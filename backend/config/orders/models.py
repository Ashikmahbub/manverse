from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import pre_save
from django.dispatch import receiver


class Order(models.Model):

    STATUS_CHOICES = [
        ("PENDING",   "Pending"),
        ("PAID",      "Paid"),
        ("FAILED",    "Failed"),
        ("CANCELLED", "Cancelled"),
        ("SHIPPED",   "Shipped"),
        ("DELIVERED", "Delivered"),
        ("REFUNDED",  "Refunded"),
    ]

    PAYMENT_METHODS = [
        ("sslcommerz", "SSLCommerz"),
        ("stripe",     "Stripe"),
        ("cod",        "Cash on Delivery"),
    ]

    user = models.ForeignKey(
        User, on_delete=models.SET_NULL,
        null=True, blank=True, related_name="orders"
    )

    full_name = models.CharField(max_length=120)
    phone     = models.CharField(max_length=20)
    address   = models.TextField()
    city      = models.CharField(max_length=60)
    postcode  = models.CharField(max_length=20, blank=True, default="")  # NEW

    total_amount    = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_charge = models.DecimalField(max_digits=6, decimal_places=2, default=60)  # NEW
    status          = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")
    payment_method  = models.CharField(max_length=20, choices=PAYMENT_METHODS, default="sslcommerz")

    tran_id      = models.CharField(max_length=80, unique=True, blank=True)
    val_id       = models.CharField(max_length=80, blank=True)
    bank_tran_id = models.CharField(max_length=80, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order #{self.tran_id} — {self.full_name} — {self.status}"

    @property
    def item_count(self):
        return sum(item.quantity for item in self.items.all())

    @property
    def order_code(self):
        return self.tran_id  # alias for frontend consistency


class OrderItem(models.Model):
    order    = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product  = models.CharField(max_length=200)
    size     = models.CharField(max_length=20,  blank=True)
    color    = models.CharField(max_length=40,  blank=True)
    price    = models.DecimalField(max_digits=8, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.product} x{self.quantity}"

    @property
    def subtotal(self):
        return self.price * self.quantity


# ── Status change signal → triggers email on every status change ──────────────
@receiver(pre_save, sender=Order)
def on_status_change(sender, instance, **kwargs):
    if not instance.pk:
        return  # new order, handled separately
    try:
        old = Order.objects.get(pk=instance.pk)
    except Order.DoesNotExist:
        return
    if old.status != instance.status:
        # import here to avoid circular imports
        from .tasks import send_status_email
        send_status_email.delay(instance.pk, instance.status)