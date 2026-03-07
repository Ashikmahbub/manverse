from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/products/", include("products.urls")),
    path("api/orders/", include("orders.urls")),
    path("api/users/", include("users.urls")),
]


# Now your URLs will be:
# ```
# POST /api/users/register/       ← register
# POST /api/users/login/          ← get tokens
# POST /api/users/token/refresh/  ← refresh token
# GET  /api/users/profile/        ← user profile