# backend/config/orders/models.py
from django.db import models
from django.contrib.auth.models import User


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

    # ── WHO PLACED IT ──────────────────────────────────────────
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="orders"
    )

    # ── DELIVERY INFO ──────────────────────────────────────────
    full_name = models.CharField(max_length=120)
    phone     = models.CharField(max_length=20)
    address   = models.TextField()
    city      = models.CharField(max_length=60)

    # ── PAYMENT ────────────────────────────────────────────────
    total_amount   = models.DecimalField(max_digits=10, decimal_places=2)
    status         = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING"
    )
    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHODS,
        default="sslcommerz"
    )

    # ── SSLCOMMERZ FIELDS ──────────────────────────────────────
    tran_id      = models.CharField(max_length=80, unique=True, blank=True)
    val_id       = models.CharField(max_length=80, blank=True)
    bank_tran_id = models.CharField(max_length=80, blank=True)

    # ── TIMESTAMPS ─────────────────────────────────────────────
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order #{self.id} — {self.full_name} — {self.status}"

    @property
    def item_count(self):
        return sum(item.quantity for item in self.items.all())


class OrderItem(models.Model):
    order    = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items"
    )
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