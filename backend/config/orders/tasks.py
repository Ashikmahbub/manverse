from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_order_emails(self, order_id):
    try:
        from .models import Order
        from .invoice import generate_invoice_pdf

        order = Order.objects.select_related('user').prefetch_related('items').get(id=order_id)

        context = {
            'order':           order,
            'items':           order.items.all(),
            'total':           order.total_amount,
            'delivery_charge': order.delivery_charge,
            'tran_id':         order.tran_id,
            'full_name':       order.full_name,
            'phone':           order.phone,
            'address':         order.address,
            'city':            order.city,
            'postcode':        order.postcode,
            'payment_method':  order.get_payment_method_display(),
            'site_url':        settings.FRONTEND_BASE_URL,
        }

        # ── Generate PDF invoice ─────────────────────────────
        try:
            pdf_bytes = generate_invoice_pdf(order)
            pdf_name  = f"Manverse-Invoice-{order.tran_id}.pdf"
        except Exception as e:
            logger.warning(f"[ORDER {order_id}] PDF generation failed: {e}")
            pdf_bytes = None
            pdf_name  = None

        # ── Customer email ───────────────────────────────────
        customer_email = order.user.email if order.user and order.user.email else None
        if customer_email:
            msg = EmailMultiAlternatives(
                subject    = f"Manverse — Order Confirmed {order.tran_id}",
                body       = render_to_string('orders/email_invoice.txt', context),
                from_email = settings.DEFAULT_FROM_EMAIL,
                to         = [customer_email],
            )
            msg.attach_alternative(
                render_to_string('orders/email_invoice.html', context), "text/html"
            )
            # Attach PDF if generated successfully
            if pdf_bytes:
                msg.attach(pdf_name, pdf_bytes, "application/pdf")

            msg.send()
            logger.info(f"[ORDER {order_id}] Customer email + invoice → {customer_email}")
        else:
            logger.warning(f"[ORDER {order_id}] No customer email, skipping")

        # ── Admin email ──────────────────────────────────────
        admin_email = getattr(settings, 'ADMIN_EMAIL', None)
        if admin_email:
            msg = EmailMultiAlternatives(
                subject    = f"[Manverse] New Order {order.tran_id} — {order.full_name}",
                body       = render_to_string('orders/email_admin.txt', context),
                from_email = settings.DEFAULT_FROM_EMAIL,
                to         = [admin_email],
            )
            msg.attach_alternative(
                render_to_string('orders/email_admin.html', context), "text/html"
            )
            if pdf_bytes:
                msg.attach(pdf_name, pdf_bytes, "application/pdf")
            msg.send()
            logger.info(f"[ORDER {order_id}] Admin email → {admin_email}")

    except Exception as exc:
        logger.error(f"[ORDER {order_id}] Email task failed: {exc}")
        raise self.retry(exc=exc)


# ── Status update emails ──────────────────────────────────────────────────────
STATUS_CONFIG = {
    "PAID":      {"subject": "✅ Order Confirmed",        "template": "orders/email_status_paid.html"},
    "SHIPPED":   {"subject": "🚚 Your Order is Shipped",  "template": "orders/email_status_shipped.html"},
    "DELIVERED": {"subject": "📦 Order Delivered",        "template": "orders/email_status_delivered.html"},
    "CANCELLED": {"subject": "❌ Order Cancelled",        "template": "orders/email_status_cancelled.html"},
    "REFUNDED":  {"subject": "💸 Order Refunded",         "template": "orders/email_status_refunded.html"},
    "FAILED":    {"subject": "⚠ Payment Failed",          "template": "orders/email_status_failed.html"},
}

@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_status_email(self, order_id, new_status):
    config = STATUS_CONFIG.get(new_status)
    if not config:
        return  # PENDING — no email needed

    try:
        from .models import Order
        order = Order.objects.select_related('user').prefetch_related('items').get(id=order_id)

        customer_email = order.user.email if order.user and order.user.email else None
        if not customer_email:
            logger.warning(f"[ORDER {order_id}] No email for status {new_status}")
            return

        context = {
            'order':           order,
            'items':           order.items.all(),
            'total':           order.total_amount,
            'delivery_charge': order.delivery_charge,
            'tran_id':         order.tran_id,
            'full_name':       order.full_name,
            'phone':           order.phone,
            'address':         order.address,
            'city':            order.city,
            'status':          new_status,
            'payment_method':  order.get_payment_method_display(),
            'site_url':        settings.FRONTEND_BASE_URL,
        }

        subject = f"Manverse — {config['subject']} · {order.tran_id}"

        try:
            html_body = render_to_string(config['template'], context)
            txt_body  = render_to_string('orders/email_status_base.txt', context)
        except Exception:
            txt_body = (
                f"Hi {order.full_name},\n\n"
                f"Your order {order.tran_id} status has been updated to: {new_status}.\n\n"
                f"Total: ৳{order.total_amount}\n"
                f"Delivery: ৳{order.delivery_charge}\n"
                f"Track your order at: {settings.FRONTEND_BASE_URL}/profile\n\n"
                f"— Manverse Team"
            )
            html_body = None

        msg = EmailMultiAlternatives(
            subject    = subject,
            body       = txt_body,
            from_email = settings.DEFAULT_FROM_EMAIL,
            to         = [customer_email],
        )
        if html_body:
            msg.attach_alternative(html_body, "text/html")
        msg.send()
        logger.info(f"[ORDER {order_id}] Status email ({new_status}) → {customer_email}")

    except Exception as exc:
        logger.error(f"[ORDER {order_id}] Status email failed: {exc}")
        raise self.retry(exc=exc)