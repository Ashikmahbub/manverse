from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from orders.models import Order, OrderItem
from .serializers import RegisterSerializer, UserSerializer


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'User created successfully',
                'user': UserSerializer(user).data
            }, status=201)
        return Response(serializer.errors, status=400)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class OrderHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            orders = Order.objects.all().order_by('-created_at')[:20]
            data = []
            for order in orders:
                items = OrderItem.objects.filter(order=order)
                data.append({
                    'id': order.id,
                    'status': order.status,
                    'total_amount': str(order.total_amount),
                    'created_at': order.created_at.strftime('%b %d, %Y'),
                    'items': [
                        {
                            'product': i.product,
                            'quantity': i.quantity,
                            'price': str(i.price)
                        } for i in items
                    ]
                })
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)