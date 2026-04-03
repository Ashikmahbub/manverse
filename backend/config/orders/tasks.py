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
        order = Order.objects.select_related('user').prefetch_related('items').get(id=order_id)

        context = {
            'order':          order,
            'items':          order.items.all(),
            'total':          order.total_amount,
            'tran_id':        order.tran_id,
            'full_name':      order.full_name,
            'phone':          order.phone,
            'address':        order.address,
            'city':           order.city,
            'payment_method': order.get_payment_method_display(),
            'site_url':       settings.FRONTEND_BASE_URL,
        }

        # ── Customer email ──────────────────────────────────
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
            msg.send()
            logger.info(f"[ORDER {order_id}] Customer email → {customer_email}")
        else:
            logger.warning(f"[ORDER {order_id}] No customer email, skipping")

        # ── Admin email ─────────────────────────────────────
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
            msg.send()
            logger.info(f"[ORDER {order_id}] Admin email → {admin_email}")

    except Exception as exc:
        logger.error(f"[ORDER {order_id}] Email task failed: {exc}")
        raise self.retry(exc=exc)