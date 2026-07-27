from rest_framework.routers import DefaultRouter
from django.urls import path

from .views import (
    AdminUserViewSet, LoginView, OTPRequestView, OTPVerifyView,
    ProfileMeView, RefreshTokenView, RegisterView,
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
    path("profile/me/", ProfileMeView.as_view(), name="profile-me"),
] + router.urls