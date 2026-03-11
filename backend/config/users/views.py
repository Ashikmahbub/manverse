from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import RegisterSerializer, UserSerializer


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'User created successfully',
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class OrderHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(phone=request.user.username).order_by('-created_at')
        # Better: link orders to user
        data = []
        for order in Order.objects.all().order_by('-created_at')[:20]:
            items = OrderItem.objects.filter(order=order)
            data.append({
                'id': order.id,
                'status': order.status,
                'total_amount': str(order.total_amount),
                'created_at': order.created_at.strftime('%b %d, %Y'),
                'items': [{'product': i.product, 'quantity': i.quantity, 'price': str(i.price)} for i in items]
            })
        return Response(data)