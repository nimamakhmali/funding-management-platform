from rest_framework.routers import DefaultRouter
from django.urls import path

from .views import (
    InvestorPayoutsView,
    InvestorProfitSummaryView,
    PayoutApproveView,
    PayoutSejamSettleView,
    ProfitPeriodViewSet,
    SejamCallbackView,
)

app_name = "profits"

router = DefaultRouter()
router.register(r"profit-periods", ProfitPeriodViewSet, basename="profit-period")

urlpatterns = [
    path("payouts/<uuid:pk>/approve/", PayoutApproveView.as_view(), name="payout-approve"),
    path("payouts/<uuid:pk>/settle-sejam/", PayoutSejamSettleView.as_view(), name="payout-settle-sejam"),
    path("payouts/sejam/callback/", SejamCallbackView.as_view(), name="payout-sejam-callback"),
    path("investor/payouts/", InvestorPayoutsView.as_view(), name="investor-payouts"),
    path("investor/profit-summary/", InvestorProfitSummaryView.as_view(), name="investor-profit-summary"),
] + router.urls