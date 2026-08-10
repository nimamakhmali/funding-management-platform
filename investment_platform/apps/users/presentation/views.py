from django.conf import settings
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action, authentication_classes
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from rest_framework.exceptions import ValidationError as DRFValidationError

from apps.users.application.dtos import (
    CompleteIndividualProfileDTO, CompleteLegalEntityProfileDTO,
    RegisterUserDTO, ResetPasswordDTO, UpdateProfileDTO,
)
from apps.users.application.use_cases import (
    complete_individual_profile, complete_legal_entity_profile,
    create_otp, register_user, reset_password, update_profile, verify_otp,
)
from apps.users.domain.exceptions import (
    OTPAttemptsExceeded, OTPCooldownActive, OTPInvalidOrExpired,
    ProfileAlreadyCompleted, UserAlreadyExists, UserNotFound,
)
from apps.users.infrastructure.models import User, UserProfile, OTPPurpose
from shared.permissions import IsObserverOrAbove, IsOperatorOrAdmin
from shared.responses import error_response, success_response
from shared.throttles import AuthRateThrottle, OTPRequestThrottle, OTPVerifyThrottle

from .serializers import (
    AdminUserStatusSerializer, CompleteIndividualProfileSerializer, CompleteLegalEntityProfileSerializer,
    CustomTokenObtainPairSerializer, ForgotPasswordSerializer, OTPRequestSerializer, OTPVerifySerializer,
    ResetPasswordSerializer, UserProfileSerializer, UserRegistrationSerializer, UserSerializer,
)

from .serializers import CustomTokenObtainPairSerializer


@extend_schema(tags=["Auth"], summary="ورود با شماره موبایل و رمز عبور")
class LoginView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AuthRateThrottle]
    serializer_class = CustomTokenObtainPairSerializer  # ← این خط اضافه شود

@extend_schema(tags=["Auth"], summary="تمدید access token")
class RefreshTokenView(TokenRefreshView):
    permission_classes = [permissions.AllowAny]


@authentication_classes([])
@extend_schema(tags=["Auth"], summary="ثبت‌نام کاربر جدید", request=UserRegistrationSerializer)
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AuthRateThrottle]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        try:
            user = register_user.execute(RegisterUserDTO(
                phone_number=d["phone_number"], role=d.get("role", "INVESTOR"),
            ))
        except UserAlreadyExists as exc:
            return error_response(exc.message, status_code=status.HTTP_409_CONFLICT)
        return success_response({"id": str(user.id), "phone_number": user.phone_number},
                                 message="ثبت‌نام با موفقیت انجام شد.", status_code=status.HTTP_201_CREATED)


@authentication_classes([])
@extend_schema(
    tags=["Auth"], summary="درخواست کد OTP", request=OTPRequestSerializer,
    description="پاسخ همیشه یکسان است (جلوگیری از User Enumeration طبق ASVS L2).",
)
class OTPRequestView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [OTPRequestThrottle]

    def post(self, request):
        serializer = OTPRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone_number = serializer.validated_data.get("phone_number")

        user = User.objects.filter(phone_number=phone_number).first()

        generic = {"status": "otp_sent", "detail": "در صورت وجود حساب کاربری فعال، کد تایید ارسال شد."}

        if not user or not user.is_active:
            return success_response(generic)

        try:
            otp = create_otp.execute(user=user, purpose=serializer.validated_data["purpose"])
        except OTPCooldownActive as exc:
            return error_response(exc.message, status_code=status.HTTP_429_TOO_MANY_REQUESTS)

        payload = dict(generic)
        payload["expires_at"] = otp.expires_at
        if settings.DEBUG:
            payload["dev_code"] = otp.code
        return success_response(payload)


@authentication_classes([])
@extend_schema(tags=["Auth"], summary="تأیید OTP و دریافت JWT", request=OTPVerifySerializer)
class OTPVerifyView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [OTPVerifyThrottle]

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone_number = serializer.validated_data.get("phone_number")

        user = User.objects.filter(phone_number=phone_number).first()

        if not user:
            return error_response("کد تایید نامعتبر یا منقضی شده است.")

        try:
            is_valid = verify_otp.execute(user=user, code=serializer.validated_data["code"],
                                           purpose=serializer.validated_data["purpose"])
        except OTPAttemptsExceeded as exc:
            return error_response(exc.message, status_code=status.HTTP_429_TOO_MANY_REQUESTS)

        if not is_valid:
            return error_response("کد تایید نامعتبر یا منقضی شده است.")

        refresh = RefreshToken.for_user(user)
        return success_response({"access": str(refresh.access_token), "refresh": str(refresh)})


@authentication_classes([])
@extend_schema(tags=["Auth"], summary="فراموشی رمز عبور - ارسال OTP", request=ForgotPasswordSerializer)
class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [OTPRequestThrottle]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone_number = serializer.validated_data["phone_number"]

        user = User.objects.filter(phone_number=phone_number).first()
        generic = {"status": "otp_sent", "detail": "در صورت وجود حساب کاربری، کد تایید ارسال شد."}

        if not user or not user.is_active:
            return success_response(generic)

        try:
            otp = create_otp.execute(user=user, purpose=OTPPurpose.RESET_PASSWORD)  # ✅
        except OTPCooldownActive as exc:
            return error_response(exc.message, status_code=status.HTTP_429_TOO_MANY_REQUESTS)

        payload = dict(generic)
        payload["expires_at"] = otp.expires_at
        if settings.DEBUG:
            payload["dev_code"] = otp.code
        return success_response(payload)


@authentication_classes([])
@extend_schema(tags=["Auth"], summary="بازیابی رمز عبور با OTP", request=ResetPasswordSerializer)
class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [OTPVerifyThrottle]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data

        try:
            user = reset_password.execute(ResetPasswordDTO(
                phone_number=d["phone_number"],
                code=d["code"],
                new_password=d["new_password"],
            ))
        except (UserNotFound, OTPInvalidOrExpired) as exc:
            return error_response(str(exc), status_code=status.HTTP_400_BAD_REQUEST)
        except OTPAttemptsExceeded as exc:
            return error_response(exc.message, status_code=status.HTTP_429_TOO_MANY_REQUESTS)

        return success_response({"id": str(user.id)}, message="رمز عبور با موفقیت تغییر کرد.")


@authentication_classes([])
@extend_schema(tags=["Auth"], summary="تکمیل اطلاعات پروفایل (حقیقی)")
class CompleteIndividualProfileView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AuthRateThrottle]

    def post(self, request):
        serializer = CompleteIndividualProfileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data

        try:
            profile = complete_individual_profile.execute(CompleteIndividualProfileDTO(
                phone_number=d["phone_number"],
                first_name=d["first_name"],
                last_name=d["last_name"],
                national_id=d["national_id"],
                date_of_birth=str(d["date_of_birth"]),
                password=d["password"],
                password_confirm=d["password_confirm"],
                contact_number=d.get("contact_number", ""),
                email=d.get("email", ""),
            ))
        except (UserNotFound, ProfileAlreadyCompleted) as exc:
            return error_response(str(exc), status_code=status.HTTP_400_BAD_REQUEST)
        except DRFValidationError as exc:
            # خطاهای validation مثل کد ملی تکراری
            return error_response(
                str(exc.detail),
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        return success_response(
            {"profile_type": profile.profile_type},
            message="پروفایل با موفقیت تکمیل شد.",
        )

@authentication_classes([])
@extend_schema(tags=["Auth"], summary="تکمیل اطلاعات پروفایل (حقوقی)", request=CompleteLegalEntityProfileSerializer)
class CompleteLegalEntityProfileView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AuthRateThrottle]

    def post(self, request):
        serializer = CompleteLegalEntityProfileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data

        try:
            profile = complete_legal_entity_profile.execute(CompleteLegalEntityProfileDTO(
                phone_number=d["phone_number"],
                entity_type=d["entity_type"],
                company_name_persian=d["company_name_persian"],
                company_name_latin=d["company_name_latin"],
                ceo_name=d["ceo_name"],
                surname=d["surname"],
                password=d["password"],
                password_confirm=d["password_confirm"],
                country=d["country"],
                province=d["province"],
                postal_code=d["postal_code"],
                contact_number=d.get("contact_number", ""),
                email=d.get("email", ""),
            ))
        except UserNotFound as exc:
            return error_response(str(exc), status_code=status.HTTP_404_NOT_FOUND)
        except ProfileAlreadyCompleted as exc:
            return error_response(str(exc), status_code=status.HTTP_400_BAD_REQUEST)

        return success_response({"profile_type": profile.profile_type}, message="پروفایل با موفقیت تکمیل شد.")


@extend_schema(tags=["Profile"], summary="مشاهده / ویرایش پروفایل من")
class ProfileMeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        return success_response(UserProfileSerializer(profile).data)

    def put(self, request):
        allowed = {"company_name", "address", "bio", "avatar_url", "bank_account_sheba"}
        dto = UpdateProfileDTO(**{k: v for k, v in request.data.items() if k in allowed})
        profile = update_profile.execute(user=request.user, dto=dto)
        return success_response(UserProfileSerializer(profile).data, message="پروفایل به‌روزرسانی شد.")


@extend_schema_view(
    list=extend_schema(tags=["Admin"], summary="لیست کاربران (ادمین/ناظر)"),
    retrieve=extend_schema(tags=["Admin"], summary="جزئیات کاربر"),
)
class AdminUserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all().order_by("-created_at")
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsObserverOrAbove]

    @extend_schema(tags=["Admin"], summary="فعال/غیرفعال‌سازی کاربر (اپراتور/ادمین)")
    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated, IsOperatorOrAdmin])
    def set_active(self, request, pk=None):
        user = self.get_object()
        serializer = AdminUserStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user.is_active = serializer.validated_data["is_active"]
        user.save(update_fields=["is_active"])
        return success_response({"id": str(user.id), "is_active": user.is_active})