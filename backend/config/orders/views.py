from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Order, OrderItem

class CreateOrder(APIView):
    def post(self, request):
        data = request.data

        order = Order.objects.create(
            full_name=data['full_name'],
            phone=data['phone'],
            address=data['address'],
            city=data['city'],
            total_amount=data['total_amount']
        )

        for item in data['items']:
            OrderItem.objects.create(
                order=order,
                product=item['product'],
                size=item['size'],
                color=item['color'],
                price=item['price'],
                quantity=item['quantity']
            )

        return Response({"order_id": order.id})
