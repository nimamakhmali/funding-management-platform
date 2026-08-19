from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),

    path("api/v1/", include([
        # users: auth + profile + admin/users
        path("", include("apps.users.presentation.urls")),
        # projects
        path("", include("apps.projects.presentation.urls")),
        # investments + wallet + transactions
        path("", include("apps.investments.presentation.urls")),
        # profits
        path("", include("apps.profits.presentation.urls")),
        # support / tickets
        path("", include("apps.support.presentation.urls")),
        # notifications + audit-logs
        path("", include("apps.notifications.presentation.urls")),
    ])),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)