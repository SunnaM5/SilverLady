from django.contrib import admin
from django.utils.html import format_html

from .models import Category, Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 0
    fields = ('image', 'is_main', 'preview')
    readonly_fields = ('preview',)

    def preview(self, obj):
        if obj.pk and obj.image:
            return format_html(
                '<img src="{}" style="max-height: 80px; max-width: 120px;" />',
                obj.image.url
            )
        return '-'

    preview.short_description = 'Preview'


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('slug', 'title_ru', 'title_uz', 'title_en', 'order')
    list_editable = ('order',)
    prepopulated_fields = {'slug': ('title_en',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('slug', 'name_en', 'category', 'price', 'in_stock', 'is_featured', 'is_new', 'main_thumb')
    list_filter = ('category', 'in_stock', 'is_featured', 'is_new')
    search_fields = ('name_ru', 'name_uz', 'name_en', 'slug')
    prepopulated_fields = {'slug': ('name_en',)}
    inlines = [ProductImageInline]

    def main_thumb(self, obj):
        main = obj.images.filter(is_main=True).first() or obj.images.first()
        if main and main.image:
            return format_html(
                '<img src="{}" style="max-height: 40px; max-width: 60px;" />',
                main.image.url
            )
        return '-'

    main_thumb.short_description = 'Image'


admin.site.site_header = 'SilverLady Admin'
admin.site.site_title = 'SilverLady'
