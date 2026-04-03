# backend/config/orders/invoice.py
import io
from django.template.loader import render_to_string
from django.conf import settings
from weasyprint import HTML


def generate_invoice_pdf(order) -> bytes:
    """
    Renders email_invoice.html as a PDF and returns raw bytes.
    Reuses the existing invoice HTML template.
    """
    context = {
        'order':          order,
        'items':          order.items.all(),
        'total':          order.total_amount,
        'delivery_charge': order.delivery_charge,
        'tran_id':        order.tran_id,
        'full_name':      order.full_name,
        'phone':          order.phone,
        'address':        order.address,
        'city':           order.city,
        'postcode':       order.postcode,
        'payment_method': order.get_payment_method_display(),
        'site_url':       settings.FRONTEND_BASE_URL,
    }

    html_string = render_to_string('orders/email_invoice.html', context)
    pdf_bytes   = HTML(string=html_string, base_url=settings.FRONTEND_BASE_URL).write_pdf()
    return pdf_bytes