import stripe
import uuid
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Order, OrderItem
from .tasks import send_order_emails


stripe.api_key = settings.STRIPE_SECRET_KEY


class StripeCreatePaymentView(APIView):
    """
    POST /api/orders/stripe/create-payment/
    Creates a Stripe Payment Intent
    Returns client_secret to frontend
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data  = request.data
        items = data.get("items", [])

        if not items:
            return Response({"error": "Cart is empty"}, status=400)

        total_usd = float(data.get("total_usd", 0))
        if total_usd <= 0:
            return Response({"error": "Invalid amount"}, status=400)

        # Amount in cents for Stripe
        amount_cents = int(total_usd * 100)

        tran_id = f"MV-STRIPE-{uuid.uuid4().hex[:10].upper()}"

        # Create pending order
         order = Order.objects.create(
            user            = request.user,
            full_name       = data.get("full_name", ""),
            phone           = data.get("phone", ""),
            address         = data.get("address", ""),
            city            = data.get("city", ""),
            postcode        = data.get("postcode", ""),      # ← add
            total_amount    = total_usd,
            delivery_charge = 0,                             # ← add (stripe = USD, no BD delivery)
            tran_id         = tran_id,
            status          = "PENDING",
            payment_method  = "stripe",
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

        # Create Stripe Payment Intent
        try:
            intent = stripe.PaymentIntent.create(
                amount      = amount_cents,
                currency    = "usd",
                metadata    = {
                    "order_id": order.id,
                    "tran_id":  tran_id,
                    "user_id":  request.user.id,
                },
                description = f"Manverse Order #{order.id}",
            )
        except stripe.error.StripeError as e:
            order.delete()
            return Response({"error": str(e)}, status=502)

        return Response({
            "client_secret":   intent.client_secret,
            "payment_intent":  intent.id,
            "order_id":        order.id,
            "tran_id":         tran_id,
            "amount":          total_usd,
            "publishable_key": settings.STRIPE_PUBLISHABLE_KEY,
        })


class StripeConfirmPaymentView(APIView):
    """
    POST /api/orders/stripe/confirm/
    Called by frontend after payment succeeds
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        payment_intent_id = request.data.get("payment_intent_id")
        tran_id           = request.data.get("tran_id")

        if not payment_intent_id or not tran_id:
            return Response({"error": "Missing fields"}, status=400)

        # Verify with Stripe
        try:
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        except stripe.error.StripeError as e:
            return Response({"error": str(e)}, status=502)

        if intent.status != "succeeded":
            return Response({
                "error":  "Payment not completed",
                "status": intent.status
            }, status=400)

        # Mark order as paid
        try:
            order = Order.objects.get(tran_id=tran_id, user=request.user)
            if order.status != "PAID":
                order.status = "PAID"
                order.val_id = payment_intent_id
                order.save()
                send_order_emails.delay(order.id)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)

        return Response({
            "status":   "PAID",
            "order_id": order.id,
            "tran_id":  order.tran_id,
            "total":    str(order.total_amount),
        })


@method_decorator(csrf_exempt, name="dispatch")
class StripeWebhookView(APIView):
    """
    POST /api/orders/stripe/webhook/
    Stripe calls this server-to-server (most reliable)
    """
    permission_classes = [AllowAny]

    def post(self, request):
        payload    = request.body
        sig_header = request.META.get("HTTP_STRIPE_SIGNATURE", "")

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header,
                settings.STRIPE_WEBHOOK_SECRET
            )
        except (ValueError, stripe.error.SignatureVerificationError):
            return Response({"error": "Invalid signature"}, status=400)

        # Handle payment success
        if event["type"] == "payment_intent.succeeded":
            intent   = event["data"]["object"]
            order_id = intent["metadata"].get("order_id")
            tran_id  = intent["metadata"].get("tran_id")

            try:
                order = Order.objects.get(id=order_id, tran_id=tran_id)
                if order.status != "PAID":
                    order.status = "PAID"
                    order.val_id = intent["id"]
                    order.save()
                    send_order_emails.delay(order.id)
            except Order.DoesNotExist:
                pass

        # Handle payment failure
        elif event["type"] == "payment_intent.payment_failed":
            intent   = event["data"]["object"]
            order_id = intent["metadata"].get("order_id")
            try:
                order        = Order.objects.get(id=order_id)
                order.status = "FAILED"
                order.save()
            except Order.DoesNotExist:
                pass

        return Response({"status": "ok"})