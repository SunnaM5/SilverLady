from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, re_path

from config.views import SPAIndexView
from shop import views as shop_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/categories/', shop_views.CategoryList.as_view()),
    path('api/products/', shop_views.ProductList.as_view()),
    path('api/products/<slug:slug>/', shop_views.ProductDetail.as_view()),
    path('api/share/telegram-link/', shop_views.TelegramLinkView.as_view()),
]

# SPA: in production serve index.html for all non-API routes
if not settings.DEBUG:
    urlpatterns += [
        re_path(r'^(?!api/|admin/|static/|media/).*$', SPAIndexView.as_view(), name='spa'),
    ]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    # В dev не раздаём /static/ из STATIC_ROOT — runserver сам отдаёт статику админки из пакетов Django
