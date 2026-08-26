from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)


def health_check(request):
    return HttpResponse("healthy", content_type="text/plain", status=200)


urlpatterns = [
    path("health/", health_check, name="health-check"),
    path("django-admin/", admin.site.urls),  # ← فقط این خط تغییر کرد
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),

    path("api/v1/", include([
        path("", include("apps.users.presentation.urls")),
        path("", include("apps.projects.presentation.urls")),
        path("", include("apps.investments.presentation.urls")),
        path("", include("apps.investments.presentation.admin_urls")),
        path("", include("apps.profits.presentation.urls")),
        path("", include("apps.support.presentation.urls")),
        path("", include("apps.notifications.presentation.urls")),
    ])),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)