from .views import (
    InitiatePaymentView,
    PaymentSuccessView,
    PaymentFailView,
    PaymentCancelView,
    PaymentIPNView,
    OrderStatusView,
    OrderHistoryView,
    OrderDetailView,
    CODOrderView,          # ← add this
)
from .stripe_views import (
    StripeCreatePaymentView,
    StripeConfirmPaymentView,
    StripeWebhookView,
)

urlpatterns = [
    path("payment/initiate/",       InitiatePaymentView.as_view()),
    path("payment/success/",        PaymentSuccessView.as_view()),
    path("payment/fail/",           PaymentFailView.as_view()),
    path("payment/cancel/",         PaymentCancelView.as_view()),
    path("payment/ipn/",            PaymentIPNView.as_view()),
    path("stripe/create-payment/",  StripeCreatePaymentView.as_view()),
    path("stripe/confirm/",         StripeConfirmPaymentView.as_view()),
    path("stripe/webhook/",         StripeWebhookView.as_view()),
    path("status/<str:tran_id>/",   OrderStatusView.as_view()),
    path("history/",                OrderHistoryView.as_view()),
    path("detail/<str:tran_id>/",   OrderDetailView.as_view()),
    path("create/",                 CODOrderView.as_view()),   # ← add this
]