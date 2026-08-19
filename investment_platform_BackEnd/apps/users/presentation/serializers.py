from rest_framework import serializers
from django.core.validators import RegexValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from apps.users.infrastructure.models import OTPPurpose, User, UserRole, UserProfile


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["phone_number"] = user.phone_number
        token["username"] = user.username or ""
        return token


class UserMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "phone_number"]
        read_only_fields = fields


class UserSerializer(serializers.ModelSerializer):
    national_code_masked = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id", "username", "phone_number", "role",
            "national_code_masked", "is_active", "phone_verified", "created_at",
        ]
        read_only_fields = ["id", "is_active", "phone_verified", "created_at", "role"]

    def get_national_code_masked(self, obj):
        if not obj.national_code or len(obj.national_code) < 5:
            return obj.national_code
        return f"{obj.national_code[:3]}****{obj.national_code[-2:]}"


class UserRegistrationSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=UserRole.choices)
    phone_number = serializers.CharField(
        min_length=13, max_length=13,
        validators=[RegexValidator(
            regex=r"^\+98\d{10}$",
            message="شماره موبایل باید با +98 و سپس ۱۰ رقم باشد."
        )]
    )

    class Meta:
        model = User
        fields = ["phone_number", "role"]

    def validate(self, attrs):
        if attrs.get("role") == "ADMIN":
            raise serializers.ValidationError({"role": "ثبت‌نام مستقیم با نقش ادمین مجاز نیست."})
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserMinimalSerializer(read_only=True)
    email = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            "id", "user", "email", "role", "full_name", "profile_type",
            "first_name", "last_name", "date_of_birth",
            "contact_number", "entity_type",
            "company_name_persian", "company_name_latin",
            "ceo_name", "surname", "country", "province", "postal_code",
            "company_name", "address", "bio", "avatar_url",
            "bank_account_number",   # ← درست (نه bank_account_sheba)
            "created_at", "updated_at",
        ]
        read_only_fields = [
            "id", "user", "email", "role", "full_name", "created_at", "updated_at"
        ]

    def get_email(self, obj) -> str:
        return obj.user.email or ""

    def get_role(self, obj) -> str:
        return obj.user.role

    def get_full_name(self, obj) -> str:
        if obj.profile_type == UserProfile.ProfileType.INDIVIDUAL:
            parts = [obj.first_name, obj.last_name]
            name = " ".join(p for p in parts if p)
            return name or obj.user.username
        elif obj.profile_type == UserProfile.ProfileType.LEGAL_ENTITY:
            return (
                obj.company_name_persian
                or obj.company_name
                or obj.user.username
            )
        return obj.user.username

class OTPRequestSerializer(serializers.Serializer):
    phone_number = serializers.CharField(
        min_length=13, max_length=13,
        validators=[RegexValidator(
            regex=r"^\+98\d{10}$",
            message="شماره موبایل باید با +98 و سپس ۱۰ رقم باشد."
        )]
    )
    purpose = serializers.ChoiceField(
        choices=OTPPurpose.choices, required=False, default=OTPPurpose.LOGIN
    )


class OTPVerifySerializer(serializers.Serializer):
    phone_number = serializers.CharField(
        min_length=13, max_length=13,
        validators=[RegexValidator(
            regex=r"^\+98\d{10}$",
            message="شماره موبایل باید با +98 و سپس ۱۰ رقم باشد."
        )]
    )
    code = serializers.CharField(min_length=6, max_length=6)
    purpose = serializers.ChoiceField(
        choices=OTPPurpose.choices, required=False, default=OTPPurpose.LOGIN
    )


class AdminUserStatusSerializer(serializers.Serializer):
    is_active = serializers.BooleanField()


class ForgotPasswordSerializer(serializers.Serializer):
    phone_number = serializers.CharField(
        min_length=13, max_length=13,
        validators=[RegexValidator(
            regex=r"^\+98\d{10}$",
            message="شماره موبایل باید با +98 و سپس ۱۰ رقم باشد."
        )]
    )


class ResetPasswordSerializer(serializers.Serializer):
    phone_number = serializers.CharField(
        min_length=13, max_length=13,
        validators=[RegexValidator(
            regex=r"^\+98\d{10}$",
            message="شماره موبایل باید با +98 و سپس ۱۰ رقم باشد."
        )]
    )
    code = serializers.CharField(min_length=6, max_length=6)
    new_password = serializers.CharField(
        write_only=True, min_length=8, style={"input_type": "password"}
    )
    new_password_confirm = serializers.CharField(
        write_only=True, style={"input_type": "password"}
    )

    def validate(self, attrs):
        if attrs["new_password"] != attrs["new_password_confirm"]:
            raise serializers.ValidationError(
                {"new_password": "رمز عبور و تکرار آن مطابقت ندارند."}
            )
        return attrs


class CompleteIndividualProfileSerializer(serializers.Serializer):
    phone_number = serializers.CharField(
        min_length=13, max_length=13,
        validators=[RegexValidator(
            regex=r"^\+98\d{10}$",
            message="شماره موبایل باید با +98 و سپس ۱۰ رقم باشد."
        )]
    )
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    national_id = serializers.CharField(
        max_length=10,
        validators=[RegexValidator(regex=r"^\d{10}$", message="کد ملی باید ۱۰ رقم باشد.")]
    )
    date_of_birth = serializers.DateField(
        input_formats=[
            "%Y-%m-%d", "%Y/%m/%d",
            "%Y-%m-%dT%H:%M:%S.%fZ", "%Y-%m-%dT%H:%M:%SZ",
        ]
    )
    password = serializers.CharField(
        write_only=True, min_length=8, style={"input_type": "password"}
    )
    password_confirm = serializers.CharField(
        write_only=True, style={"input_type": "password"}
    )
    contact_number = serializers.CharField(max_length=20, required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError(
                {"password": "رمز عبور و تکرار آن مطابقت ندارند."}
            )
        return attrs


class CompleteLegalEntityProfileSerializer(serializers.Serializer):
    phone_number = serializers.CharField(
        min_length=13, max_length=13,
        validators=[RegexValidator(
            regex=r"^\+98\d{10}$",
            message="شماره موبایل باید با +98 و سپس ۱۰ رقم باشد."
        )]
    )
    entity_type = serializers.ChoiceField(choices=UserProfile.EntityType.choices)
    company_name_persian = serializers.CharField(max_length=255)
    company_name_latin = serializers.CharField(max_length=255)
    ceo_name = serializers.CharField(max_length=150)
    surname = serializers.CharField(max_length=150)
    password = serializers.CharField(
        write_only=True, min_length=8, style={"input_type": "password"}
    )
    password_confirm = serializers.CharField(
        write_only=True, style={"input_type": "password"}
    )
    country = serializers.CharField(max_length=100)
    province = serializers.CharField(max_length=100)
    postal_code = serializers.CharField(max_length=20)
    contact_number = serializers.CharField(max_length=20, required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError(
                {"password": "رمز عبور و تکرار آن مطابقت ندارند."}
            )
        return attrs