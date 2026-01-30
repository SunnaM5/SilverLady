import os
from decimal import Decimal
from io import BytesIO

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.utils.text import slugify

from shop.models import Category, Product, ProductImage


def make_placeholder_image(width=400, height=400, color='c0c0c0'):
    """Create a simple placeholder PNG (1x1 gray, browser scales)."""
    try:
        from PIL import Image
        img = Image.new('RGB', (width, height), color=f'#{color}')
        buf = BytesIO()
        img.save(buf, format='PNG')
        return ContentFile(buf.getvalue(), name='placeholder.png')
    except Exception:
        return None


class Command(BaseCommand):
    help = 'Seed categories and sample products with placeholder images'

    def add_arguments(self, parser):
        parser.add_argument('--clear', action='store_true', help='Delete existing products and categories first')

    def handle(self, *args, **options):
        if options['clear']:
            ProductImage.objects.all().delete()
            Product.objects.all().delete()
            Category.objects.all().delete()
            self.stdout.write('Cleared existing data.')

        categories_data = [
            ('bracelets', 'Браслеты', 'Bilaguzuklar', 'Bracelets'),
            ('earrings', 'Серьги', 'Taqilar', 'Earrings'),
            ('rings', 'Кольца', "Uzuklar", 'Rings'),
            ('chains', 'Цепочки', 'Zanjirlar', 'Chains'),
            ('sets', 'Комплект', "To'plam", 'Sets'),
        ]

        for i, (slug, ru, uz, en) in enumerate(categories_data):
            cat, _ = Category.objects.get_or_create(slug=slug, defaults={
                'title_ru': ru, 'title_uz': uz, 'title_en': en, 'order': i
            })
            if not _:
                cat.title_ru, cat.title_uz, cat.title_en, cat.order = ru, uz, en, i
                cat.save()
            self.stdout.write(f'Category: {slug}')

        placeholder = make_placeholder_image()
        if not placeholder:
            self.stdout.write(self.style.WARNING('PIL not installed; products will be created without images. pip install Pillow'))

        sample_products = [
            ('Silver Ring Classic', 'Серебряное кольцо классика', 'Kumush uzuk klassik', 'Classic silver ring.', 'rings', True, True),
            ('Silver Earrings Drop', 'Серьги серебро капли', "Kumush taqi tomchilar", 'Elegant drop earrings.', 'earrings', True, False),
            ('Silver Bracelet Chain', 'Браслет цепочка серебро', 'Kumush zanjir bilaguzuk', 'Chain bracelet.', 'bracelets', True, True),
            ('Silver Chain 50cm', 'Цепочка серебро 50 см', "Kumush zanjir 50 sm", 'Silver chain 50 cm.', 'chains', True, False),
            ('Set Ring + Earrings', 'Комплект кольцо и серьги', "To'plam uzuk va taqi", 'Set ring and earrings.', 'sets', True, True),
        ]

        for name_en, name_ru, name_uz, desc_en, cat_slug, in_stock, featured in sample_products:
            slug = slugify(name_en)
            cat = Category.objects.get(slug=cat_slug)
            product, created = Product.objects.get_or_create(slug=slug, defaults={
                'name_ru': name_ru, 'name_uz': name_uz, 'name_en': name_en,
                'description_ru': desc_en, 'description_uz': desc_en, 'description_en': desc_en,
                'price': Decimal('299000.00'),
                'category': cat,
                'in_stock': in_stock,
                'is_featured': featured,
                'is_new': created,
            })
            if not created:
                product.name_ru, product.name_uz, product.name_en = name_ru, name_uz, name_en
                product.description_ru = product.description_uz = product.description_en = desc_en
                product.category = cat
                product.in_stock = in_stock
                product.is_featured = featured
                product.save()

            if placeholder and not product.images.exists():
                img = ProductImage.objects.create(product=product, is_main=True)
                img.image.save('placeholder.png', placeholder, save=True)
                placeholder = make_placeholder_image()

            self.stdout.write(f'Product: {slug}')

        self.stdout.write(self.style.SUCCESS('Seed completed.'))
