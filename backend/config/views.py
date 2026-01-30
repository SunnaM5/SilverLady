from django.conf import settings
from django.http import HttpResponse
from django.views.generic import View


class SPAIndexView(View):
    """Serve SPA index.html for production (catch-all for client-side routing)."""

    def get(self, request, *args, **kwargs):
        index_path = settings.BASE_DIR / 'frontend_dist' / 'index.html'
        if index_path.exists():
            return HttpResponse(index_path.read_text(encoding='utf-8'), content_type='text/html')
        return HttpResponse('Not found', status=404)
