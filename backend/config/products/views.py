from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Product, Category
from .serializers import ProductSerializer

class CategoryListView(APIView):
    def get(self, request):
        # Get gender tabs (top level - no parent)
        gender_cats = Category.objects.filter(parent=None)
        # Get sub categories (with parent)
        sub_cats = Category.objects.filter(parent__isnull=False)
        
        return Response({
            'genders': [{'id': c.id, 'name': c.name, 'slug': c.slug} for c in gender_cats],
            'categories': [{'id': c.id, 'name': c.name, 'slug': c.slug, 'parent_id': c.parent_id} for c in sub_cats],
        })

class ProductListView(APIView):
    def get(self, request):
        category = request.query_params.get('category')
        gender = request.query_params.get('gender')
        search = request.query_params.get('search')
        sort = request.query_params.get('sort')

        products = Product.objects.filter(is_active=True)

        if category:
            products = products.filter(category__id=category)
        elif gender:
            # Filter by all subcategories under this gender
            sub_cats = Category.objects.filter(parent__slug=gender)
            products = products.filter(category__in=sub_cats)
        if search:
            products = products.filter(name__icontains=search)
        if sort == 'price_low':
            products = products.order_by('price')
        elif sort == 'price_high':
            products = products.order_by('-price')
        elif sort == 'newest':
            products = products.order_by('-id')

        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class ProductDetailView(APIView):
    def get(self, request, slug):
        try:
            product = Product.objects.get(slug=slug, is_active=True)
            serializer = ProductSerializer(product)
            return Response(serializer.data)
        except Product.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)