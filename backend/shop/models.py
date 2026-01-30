from django.db import models


class Category(models.Model):
    slug = models.SlugField(max_length=100, unique=True)
    title_ru = models.CharField(max_length=200)
    title_uz = models.CharField(max_length=200)
    title_en = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'slug']
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.title_en


class Product(models.Model):
    slug = models.SlugField(max_length=200, unique=True)
    name_ru = models.CharField(max_length=300)
    name_uz = models.CharField(max_length=300)
    name_en = models.CharField(max_length=300)
    description_ru = models.TextField(blank=True)
    description_uz = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    in_stock = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_new = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name_en


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/%Y/%m/')
    is_main = models.BooleanField(default=False)

    class Meta:
        ordering = ['-is_main', 'id']

    def __str__(self):
        return f"{self.product.slug} ({'main' if self.is_main else 'extra'})"
