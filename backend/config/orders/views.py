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
from .tasks import send_order_emails, send_status_email

ssl = SSLCommerz()


# ── Helper ────────────────────────────────────────────────────────────────────
def calc_delivery_charge(city: str) -> int:
    return 60 if city.strip().lower() == "dhaka" else 120


# ── Initiate SSLCommerz Payment ───────────────────────────────────────────────
class InitiatePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data  = request.data
        items = data.get("items", [])

        subtotal        = sum(float(i["price"]) * int(i["quantity"]) for i in items)
        delivery_charge = calc_delivery_charge(data.get("city", ""))
        total           = subtotal + delivery_charge

        tran_id = f"MV-{uuid.uuid4().hex[:12].upper()}"
        order   = Order.objects.create(
            user            = request.user,
            full_name       = data["full_name"],
            phone           = data["phone"],
            address         = data["address"],
            city            = data["city"],
            postcode        = data.get("postcode", ""),
            total_amount    = total,
            delivery_charge = delivery_charge,
            tran_id         = tran_id,
            payment_method  = "sslcommerz",
            status          = "PENDING",
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

        base   = settings.BACKEND_BASE_URL
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
            "cus_postcode":    data.get("postcode", "1000"),
            "cus_country":     "Bangladesh",
            "cus_phone":       data["phone"],
            "ship_name":       data["full_name"],
            "ship_add1":       data["address"],
            "ship_city":       data["city"],
            "ship_postcode":   data.get("postcode", "1000"),
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


# ── Cash on Delivery ──────────────────────────────────────────────────────────
class CODOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data  = request.data
        items = data.get("items", [])

        if not items:
            return Response({"error": "Cart is empty."}, status=400)

        required = ["full_name", "phone", "address", "city", "postcode"]
        missing  = [f for f in required if not data.get(f)]
        if missing:
            return Response({"error": f"Missing fields: {', '.join(missing)}"}, status=400)

        subtotal        = sum(float(i["price"]) * int(i["quantity"]) for i in items)
        delivery_charge = calc_delivery_charge(data.get("city", ""))
        total           = subtotal + delivery_charge

        tran_id = f"MV-{uuid.uuid4().hex[:12].upper()}"
        order   = Order.objects.create(
            user            = request.user,
            full_name       = data["full_name"],
            phone           = data["phone"],
            address         = data["address"],
            city            = data["city"],
            postcode        = data.get("postcode", ""),
            total_amount    = total,
            delivery_charge = delivery_charge,
            tran_id         = tran_id,
            payment_method  = "cod",
            status          = "PENDING",
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

        # Fire confirmation email immediately
        send_order_emails.delay(order.id)

        return Response({
            "order_code": order.tran_id,
            "order_id":   order.id,
            "total":      str(order.total_amount),
            "status":     order.status,
        }, status=201)


# ── SSLCommerz Callbacks ──────────────────────────────────────────────────────
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
            order = Order.objects.get(tran_id=tran_id)
            if order.status != "PAID":
                order.status = "PAID"
                order.val_id = val_id
                order.save()
                send_order_emails.delay(order.id)
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
                send_order_emails.delay(order.id)
        except Order.DoesNotExist:
            pass

        return Response({"status": "ok"})


# ── Order Status ──────────────────────────────────────────────────────────────
class OrderStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, tran_id):
        try:
            order = Order.objects.get(tran_id=tran_id, user=request.user)
            return Response({
                "status":         order.status,
                "order_id":       order.id,
                "order_code":     order.tran_id,
                "tran_id":        order.tran_id,
                "total":          str(order.total_amount),
                "delivery_charge": str(order.delivery_charge),
            })
        except Order.DoesNotExist:
            return Response({"error": "Not found"}, status=404)


# ── Order History (profile page) ──────────────────────────────────────────────
class OrderHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).prefetch_related("items").order_by("-id")
        data   = []
        for order in orders:
            data.append({
                "id":              order.id,
                "order_code":      order.tran_id,
                "tran_id":         order.tran_id,
                "status":          order.status,
                "total_amount":    str(order.total_amount),
                "delivery_charge": str(order.delivery_charge),
                "payment_method":  order.get_payment_method_display(),
                "full_name":       order.full_name,
                "phone":           order.phone,
                "address":         order.address,
                "city":            order.city,
                "created_at":      order.created_at.strftime("%d %b %Y"),
                "items": [
                    {
                        "product":  item.product,
                        "size":     item.size,
                        "color":    item.color,
                        "price":    str(item.price),
                        "quantity": item.quantity,
                        "subtotal": str(item.subtotal),
                    }
                    for item in order.items.all()
                ],
            })
        return Response(data)


# ── Order Detail ──────────────────────────────────────────────────────────────
class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, tran_id):
        try:
            order = Order.objects.prefetch_related("items").get(
                tran_id=tran_id,
                user=request.user,
            )
        except Order.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

        return Response({
            "order_code":      order.tran_id,
            "tran_id":         order.tran_id,
            "status":          order.status,
            "full_name":       order.full_name,
            "phone":           order.phone,
            "address":         order.address,
            "city":            order.city,
            "postcode":        order.postcode,
            "total_amount":    str(order.total_amount),
            "delivery_charge": str(order.delivery_charge),
            "payment_method":  order.get_payment_method_display(),
            "created_at":      order.created_at.strftime("%d %b %Y, %I:%M %p"),
            "items": [
                {
                    "product":  i.product,
                    "size":     i.size,
                    "color":    i.color,
                    "price":    str(i.price),
                    "quantity": i.quantity,
                    "subtotal": str(i.subtotal),
                }
                for i in order.items.all()
            ],
        })