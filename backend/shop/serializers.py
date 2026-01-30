from rest_framework import serializers

from .models import Category, Product, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'slug', 'title_ru', 'title_uz', 'title_en']


class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url if obj.image else None

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_main']


class ProductListSerializer(serializers.ModelSerializer):
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    main_image = serializers.SerializerMethodField()

    def get_main_image(self, obj):
        main = obj.images.filter(is_main=True).first()
        if main:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(main.image.url)
            return main.image.url
        first = obj.images.first()
        if first:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(first.image.url)
            return first.image.url
        return None

    class Meta:
        model = Product
        fields = [
            'id', 'slug', 'name_ru', 'name_uz', 'name_en',
            'price', 'category_slug', 'in_stock', 'is_featured', 'is_new',
            'main_image', 'created_at',
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    category_title_ru = serializers.CharField(source='category.title_ru', read_only=True)
    category_title_uz = serializers.CharField(source='category.title_uz', read_only=True)
    category_title_en = serializers.CharField(source='category.title_en', read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'slug', 'name_ru', 'name_uz', 'name_en',
            'description_ru', 'description_uz', 'description_en',
            'price', 'category_slug', 'category_title_ru', 'category_title_uz', 'category_title_en',
            'in_stock', 'is_featured', 'is_new',
            'images', 'created_at', 'updated_at',
        ]
