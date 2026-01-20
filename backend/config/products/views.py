from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer

class ProductList(APIView):
    def get(self, request):
        products = Product.objects.filter(is_active=True)
        return Response(ProductSerializer(products, many=True).data)


class ProductDetail(APIView):
    def get(self, request, slug):
        product = Product.objects.get(slug=slug)
        return Response(ProductSerializer(product).data)
