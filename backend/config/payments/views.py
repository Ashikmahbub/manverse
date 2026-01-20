from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from .bkash import create_bkash_payment, execute_bkash_payment

class BkashCreate(APIView):
    def post(self, request):
        amount = request.data['amount']
        order_id = request.data['order_id']
        return Response(create_bkash_payment(amount, order_id))

class BkashExecute(APIView):
    def post(self, request):
        payment_id = request.data['paymentID']
        return Response(execute_bkash_payment(payment_id))
