# backend/config/orders/views.py
import uuid
from django.http import HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Order, OrderItem
from .sslcommerz import SSLCommerz
from django.conf import settings

ssl = SSLCommerz()

class InitiatePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data  = request.data
        items = data.get("items", [])
        total = sum(
            float(i["price"]) * int(i["quantity"])
            for i in items
        )

        tran_id = f"MV-{uuid.uuid4().hex[:12].upper()}"
        order   = Order.objects.create(
            user         = request.user,
            full_name    = data["full_name"],
            phone        = data["phone"],
            address      = data["address"],
            city         = data["city"],
            total_amount = total,
            tran_id      = tran_id,
            status       = "PENDING",
        )
        for item in items:
            OrderItem.objects.create(
                order    = order,
                product  = item.get("product", ""),
                size     = item.get("size", ""),
                color    = item.get("color", ""),
                price    = float(item["price"]),
                quantity = int(item["quantity"]),
            )

        base = settings.BACKEND_BASE_URL
        result = ssl.initiate({
            "total_amount":    total,
            "tran_id":         tran_id,
            "success_url":     f"{base}/api/orders/payment/success/",
            "fail_url":        f"{base}/api/orders/payment/fail/",
            "cancel_url":      f"{base}/api/orders/payment/cancel/",
            "ipn_url":         f"{base}/api/orders/payment/ipn/",
            "cus_name":        data["full_name"],
            "cus_email":       request.user.email or "customer@manverse.com",
            "cus_add1":        data["address"],
            "cus_city":        data["city"],
            "cus_country":     "Bangladesh",
            "cus_phone":       data["phone"],
            "ship_name":       data["full_name"],
            "ship_add1":       data["address"],
            "ship_city":       data["city"],
            "ship_country":    "Bangladesh",
            "shipping_method": "Courier",
            "product_name":    "Manverse Order",
            "product_category":"Fashion",
            "product_profile": "general",
            "num_of_item":     sum(int(i["quantity"]) for i in items),
            "value_a":         str(order.id),
        })

        if result.get("status") == "SUCCESS":
            return Response({
                "payment_url": result["GatewayPageURL"],
                "tran_id":     tran_id,
                "order_id":    order.id,
            })
        order.delete()
        return Response({"error": result.get("failedreason")}, status=502)


@method_decorator(csrf_exempt, name="dispatch")
class PaymentSuccessView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        val_id  = request.data.get("val_id")
        tran_id = request.data.get("tran_id")

        if request.data.get("status") != "VALID" or not val_id:
            return HttpResponseRedirect(
                f"{settings.FRONTEND_BASE_URL}/order-fail?tran_id={tran_id}"
            )

        result = ssl.validate(val_id)
        if result.get("status") not in ("VALID", "VALIDATED"):
            return HttpResponseRedirect(
                f"{settings.FRONTEND_BASE_URL}/order-fail?tran_id={tran_id}"
            )

        try:
            order         = Order.objects.get(tran_id=tran_id)
            order.status  = "PAID"
            order.val_id  = val_id
            order.save()
        except Order.DoesNotExist:
            pass

        return HttpResponseRedirect(
            f"{settings.FRONTEND_BASE_URL}/order-success?tran_id={tran_id}"
        )


@method_decorator(csrf_exempt, name="dispatch")
class PaymentFailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        tran_id = request.data.get("tran_id")
        try:
            order        = Order.objects.get(tran_id=tran_id)
            order.status = "FAILED"
            order.save()
        except Order.DoesNotExist:
            pass
        return HttpResponseRedirect(
            f"{settings.FRONTEND_BASE_URL}/order-fail?tran_id={tran_id}"
        )


@method_decorator(csrf_exempt, name="dispatch")
class PaymentCancelView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        tran_id = request.data.get("tran_id")
        try:
            order        = Order.objects.get(tran_id=tran_id)
            order.status = "CANCELLED"
            order.save()
        except Order.DoesNotExist:
            pass
        return HttpResponseRedirect(
            f"{settings.FRONTEND_BASE_URL}/checkout?cancelled=1"
        )


@method_decorator(csrf_exempt, name="dispatch")
class PaymentIPNView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        val_id  = request.data.get("val_id")
        tran_id = request.data.get("tran_id")

        if request.data.get("status") != "VALID":
            return Response({"status": "ignored"})

        result = ssl.validate(val_id)
        if result.get("status") not in ("VALID", "VALIDATED"):
            return Response({"status": "invalid"})

        try:
            order = Order.objects.get(tran_id=tran_id)
            if order.status != "PAID":
                order.status = "PAID"
                order.val_id = val_id
                order.save()
        except Order.DoesNotExist:
            pass

        return Response({"status": "ok"})


class OrderStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, tran_id):
        try:
            order = Order.objects.get(tran_id=tran_id, user=request.user)
            return Response({
                "status":   order.status,
                "order_id": order.id,
                "tran_id":  order.tran_id,
                "total":    str(order.total_amount),
            })
        except Order.DoesNotExist:
            return Response({"error": "Not found"}, status=404)
class OrderHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by("-id")
        data = []
        for order in orders:
            items = OrderItem.objects.filter(order=order)
            data.append({
                "id":           order.id,
                "tran_id":      order.tran_id,
                "status":       order.status,
                "total_amount": str(order.total_amount),
                "full_name":    order.full_name,
                "phone":        order.phone,
                "address":      order.address,
                "city":         order.city,
                "items": [
                    {
                        "product":  item.product,
                        "size":     item.size,
                        "color":    item.color,
                        "price":    str(item.price),
                        "quantity": item.quantity,
                    }
                    for item in items
                ],
            })
        return Response(data)