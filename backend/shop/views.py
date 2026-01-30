from django.conf import settings
from django.db.models import Q
from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, Product
from .serializers import CategorySerializer, ProductDetailSerializer, ProductListSerializer


class CategoryList(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductList(ListAPIView):
    serializer_class = ProductListSerializer

    def get_queryset(self):
        qs = Product.objects.prefetch_related('images').select_related('category')
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category__slug=category)
        search = self.request.query_params.get('search', '').strip()
        if search:
            qs = qs.filter(
                Q(name_ru__icontains=search) |
                Q(name_uz__icontains=search) |
                Q(name_en__icontains=search)
            )
        min_price = self.request.query_params.get('min_price')
        if min_price is not None:
            try:
                qs = qs.filter(price__gte=float(min_price))
            except ValueError:
                pass
        max_price = self.request.query_params.get('max_price')
        if max_price is not None:
            try:
                qs = qs.filter(price__lte=float(max_price))
            except ValueError:
                pass
        in_stock = self.request.query_params.get('in_stock')
        if in_stock == 'true' or in_stock == '1':
            qs = qs.filter(in_stock=True)
        sort = self.request.query_params.get('sort', 'newest')
        if sort == 'price_asc':
            qs = qs.order_by('price')
        elif sort == 'price_desc':
            qs = qs.order_by('-price')
        else:
            qs = qs.order_by('-created_at')
        return qs


class ProductDetail(RetrieveAPIView):
    queryset = Product.objects.prefetch_related('images').select_related('category')
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'


def build_telegram_text(product=None, qty=1, from_cart=False, lang='ru', base_url='', product_name=None, price=None, product_url=None, image_url=None):
    """Build pre-filled Telegram message text."""
    parts = []
    if from_cart and product_name is not None and price is not None:
        parts.append(f"🛒 Заказ из корзины SilverLady\n")
        parts.append(f"Товар: {product_name}\n")
        parts.append(f"Цена: {price}\n")
        parts.append(f"Кол-во: {qty}\n")
        total = float(price) * qty if price else 0
        parts.append(f"Итого: {total:.2f}\n")
        if product_url:
            parts.append(f"Ссылка: {product_url}\n")
        if image_url:
            parts.append(f"Фото: {image_url}\n")
    elif product:
        name = getattr(product, f'name_{lang}', product.name_en)
        parts.append(f"SilverLady — заказ\n")
        parts.append(f"Товар: {name}\n")
        parts.append(f"Цена: {product.price}\n")
        parts.append(f"Ссылка: {base_url}/product/{product.slug}\n")
        main_img = product.images.filter(is_main=True).first() or product.images.first()
        if main_img and main_img.image:
            img_url = base_url + main_img.image.url
            parts.append(f"Фото: {img_url}\n")
    return ''.join(parts)


class TelegramLinkView(APIView):
    """Return Telegram deep-link URL for ordering."""

    def get(self, request):
        product_slug = request.query_params.get('product')
        qty = int(request.query_params.get('qty', 1) or 1)
        from_cart = request.query_params.get('from') == 'cart'
        lang = request.query_params.get('lang', 'ru')

        base_url = request.build_absolute_uri('/').rstrip('/')
        telegram_username = getattr(settings, 'TELEGRAM_USERNAME', 'zxsvgh')

        if from_cart and product_slug:
            try:
                product = Product.objects.prefetch_related('images').get(slug=product_slug)
            except Product.DoesNotExist:
                return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
            product_name = getattr(product, f'name_{lang}', product.name_en)
            price = str(product.price)
            product_url = f"{base_url}/product/{product.slug}"
            main_img = product.images.filter(is_main=True).first() or product.images.first()
            image_url = (base_url + main_img.image.url) if main_img and main_img.image else None
            text = build_telegram_text(
                product=None, qty=qty, from_cart=True,
                product_name=product_name, price=price,
                product_url=product_url, image_url=image_url
            )
        elif product_slug:
            try:
                product = Product.objects.prefetch_related('images').get(slug=product_slug)
            except Product.DoesNotExist:
                return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
            text = build_telegram_text(product=product, base_url=base_url, lang=lang)
        else:
            return Response({'error': 'product or from=cart required'}, status=status.HTTP_400_BAD_REQUEST)

        import urllib.parse
        link = f"https://t.me/{telegram_username}?text={urllib.parse.quote(text)}"
        return Response({'url': link})
