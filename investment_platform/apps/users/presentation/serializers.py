"""
Serializer های کاربران
"""
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from apps.users.infrastructure.models import (
    OTPPurpose, User, UserProfile, UserRole,
)


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "phone_number", "role", "password", "password_confirm"]

    def validate_role(self, value):
        if value == UserRole.ADMIN:
            raise serializers.ValidationError("ثبت‌نام با نقش ادمین مجاز نیست.")
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs.pop("password_confirm"):
            raise serializers.ValidationError({"password_confirm": "رمز عبور مطابقت ندارد."})
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]
        read_only_fields = fields


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "phone_number", "role",
                  "is_active", "is_verified", "created_at"]
        read_only_fields = ["id", "is_active", "is_verified", "created_at", "role"]


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserMinimalSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ["id", "user", "company_name", "bio", "avatar_url",
                  "bank_account_number", "address", "created_at", "updated_at"]
        read_only_fields = ["id", "user", "created_at", "updated_at"]


class OTPRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False, allow_null=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    purpose = serializers.ChoiceField(choices=OTPPurpose.choices, default=OTPPurpose.LOGIN)

    def validate(self, attrs):
        if not attrs.get("email") and not attrs.get("phone_number"):
            raise serializers.ValidationError("ایمیل یا شماره موبایل الزامی است.")
        return attrs


class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField(required=False, allow_null=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    code = serializers.CharField(min_length=6, max_length=6)
    purpose = serializers.ChoiceField(choices=OTPPurpose.choices, default=OTPPurpose.LOGIN)

    def validate(self, attrs):
        if not attrs.get("email") and not attrs.get("phone_number"):
            raise serializers.ValidationError("ایمیل یا شماره موبایل الزامی است.")
        return attrs


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["username"] = user.username
        return token


class AdminUserStatusSerializer(serializers.Serializer):
    is_active = serializers.BooleanField()
