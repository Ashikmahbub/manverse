 
from django.urls import path

urlpatterns = [
    path('bkash/create/', BkashCreate.as_view()),
    path('bkash/execute/', BkashExecute.as_view()),
]
