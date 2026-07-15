from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import PayoutApproveView, PayoutSejamView, ProfitPeriodViewSet

router = DefaultRouter()
router.register(r"profit-periods", ProfitPeriodViewSet, basename="profit-period")

urlpatterns = [
    path("payouts/<uuid:pk>/approve/", PayoutApproveView.as_view(), name="payout-approve"),
    path("payouts/<uuid:pk>/settle-sejam/", PayoutSejamView.as_view(), name="payout-sejam"),
    path("", include(router.urls)),
]