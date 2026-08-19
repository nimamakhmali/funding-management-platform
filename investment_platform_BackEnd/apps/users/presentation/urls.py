from rest_framework.routers import DefaultRouter
from django.urls import path

from .views import (
    AdminUserViewSet, CompleteIndividualProfileView, CompleteLegalEntityProfileView,
    ForgotPasswordView, LoginView, OTPRequestView, OTPVerifyView,
    ProfileMeView, RefreshTokenView, RegisterView, ResetPasswordView,
)

app_name = "users"

router = DefaultRouter()
router.register(r"admin/users", AdminUserViewSet, basename="admin-users")

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/refresh/", RefreshTokenView.as_view(), name="refresh"),
    path("auth/otp/request/", OTPRequestView.as_view(), name="otp-request"),
    path("auth/otp/verify/", OTPVerifyView.as_view(), name="otp-verify"),
    path("auth/password/forgot/", ForgotPasswordView.as_view(), name="forgot-password"),
    path("auth/password/reset/", ResetPasswordView.as_view(), name="reset-password"),
    path("profile/complete/individual/", CompleteIndividualProfileView.as_view(), name="complete-individual-profile"),
    path("profile/complete/legal-entity/", CompleteLegalEntityProfileView.as_view(), name="complete-legal-entity-profile"),
    path("profile/me/", ProfileMeView.as_view(), name="profile-me"),
] + router.urls