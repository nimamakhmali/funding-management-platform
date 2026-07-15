"""
Views کاربران
"""
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.users.application.use_cases import CreateOTPUseCase, VerifyOTPUseCase
from apps.users.infrastructure.models import User, UserProfile
from apps.notifications.application.use_cases import CreateAuditLogUseCase
from shared.permissions import IsAdmin
from shared.throttles import AuthThrottle, OTPThrottle
from .serializers import (
    AdminUserStatusSerializer,
    OTPRequestSerializer,
    OTPVerifySerializer,
    UserProfileSerializer,
    UserRegistrationSerializer,
    UserSerializer,
    CustomTokenObtainPairSerializer,
)


@extend_schema(tags=["Auth"], summary="ثبت‌نام کاربر جدید")
class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AuthThrottle]


@extend_schema(tags=["Auth"], summary="ورود با ایمیل و رمز عبور")
class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AuthThrottle]


@extend_schema(tags=["Auth"], summary="تمدید access token")
class TokenRefreshView(TokenRefreshView):
    permission_classes = [permissions.AllowAny]


@extend_schema(tags=["Auth"], summary="درخواست کد OTP")
class OTPRequestView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [OTPThrottle]

    def post(self, request):
        serializer = OTPRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        if data.get("email"):
            user = get_object_or_404(User, email=data["email"])
        else:
            user = get_object_or_404(User, phone_number=data["phone_number"])

        otp = CreateOTPUseCase().execute(user=user, purpose=data["purpose"])

        response_data = {
            "status": "otp_sent",
            "purpose": otp.purpose,
            "expires_at": otp.expires_at,
        }
        # نمایش کد فقط برای staff در محیط dev
        if request.user.is_authenticated and request.user.is_staff:
            response_data["dev_code"] = otp.code

        return Response(response_data)


@extend_schema(tags=["Auth"], summary="تأیید OTP و دریافت JWT")
class OTPVerifyView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [OTPThrottle]

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        if data.get("email"):
            user = get_object_or_404(User, email=data["email"])
        else:
            user = get_object_or_404(User, phone_number=data["phone_number"])

        VerifyOTPUseCase().execute(
            user=user, code=data["code"], purpose=data["purpose"]
        )

        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })


@extend_schema(tags=["Profile"], summary="پروفایل من")
class UserProfileMeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        return Response(UserProfileSerializer(profile).data)

    @extend_schema(summary="به‌روزرسانی پروفایل من")
    def put(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


@extend_schema(tags=["Admin"])
class AdminUserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all().order_by("-created_at")
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

    @extend_schema(summary="فعال/غیرفعال کردن کاربر")
    @action(detail=True, methods=["post"])
    def set_active(self, request, pk=None):
        user = self.get_object()
        serializer = AdminUserStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user.is_active = serializer.validated_data["is_active"]
        user.save(update_fields=["is_active"])
        CreateAuditLogUseCase().execute(
            actor=request.user,
            action="USER_ACTIVE_CHANGED",
            entity="User",
            entity_id=str(user.id),
            description=f"وضعیت فعال بودن کاربر به {user.is_active} تغییر کرد.",
        )
        return Response({"id": str(user.id), "is_active": user.is_active})
