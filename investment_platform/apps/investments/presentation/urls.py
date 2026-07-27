from rest_framework.routers import DefaultRouter
from django.urls import path

from .views import (
    InvestmentConfirmView, InvestmentCreateView, MockDepositView, PaymentCallbackView,
    PaymentGatewayConfigViewSet, PaymentInitiateView, TransactionHistoryView,
    WalletView, WithdrawalView,
)

app_name = "investments"

router = DefaultRouter()
router.register(r"admin/payment-gateways", PaymentGatewayConfigViewSet, basename="payment-gateway")

urlpatterns = [
    path("wallet/", WalletView.as_view(), name="wallet-detail"),
    path("wallet/deposit/", MockDepositView.as_view(), name="wallet-mock-deposit"),
    path("wallet/payment/initiate/", PaymentInitiateView.as_view(), name="wallet-payment-initiate"),
    path("wallet/payment/callback/", PaymentCallbackView.as_view(), name="wallet-payment-callback"),
    path("wallet/withdraw/", WithdrawalView.as_view(), name="wallet-withdraw"),
    path("transactions/", TransactionHistoryView.as_view(), name="transaction-list"),
    path("invest/", InvestmentCreateView.as_view(), name="invest-create"),
    path("investments/<uuid:pk>/confirm/", InvestmentConfirmView.as_view(), name="investment-confirm"),
] + router.urls