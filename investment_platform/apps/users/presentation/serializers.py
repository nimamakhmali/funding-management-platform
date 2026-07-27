from rest_framework import serializers
from apps.users.infrastructure.models import OTPPurpose, User, UserProfile


class UserMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]
        read_only_fields = fields


class UserSerializer(serializers.ModelSerializer):
    national_code_masked = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "phone_number", "role", "national_code_masked",
                  "is_active", "phone_verified", "created_at"]
        read_only_fields = ["id", "is_active", "phone_verified", "created_at", "role"]

    def get_national_code_masked(self, obj):
        if not obj.national_code or len(obj.national_code) < 5:
            return obj.national_code
        return f"{obj.national_code[:3]}****{obj.national_code[-2:]}"


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, style={"input_type": "password"})
    password_confirm = serializers.CharField(write_only=True, style={"input_type": "password"})

    class Meta:
        model = User
        fields = ["username", "email", "phone_number", "role", "password", "password_confirm"]

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({"password": "رمز عبور و تکرار آن مطابقت ندارند."})
        if attrs.get("role") == "ADMIN":
            raise serializers.ValidationError({"role": "ثبت‌نام مستقیم با نقش ادمین مجاز نیست."})
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserMinimalSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ["id", "user", "company_name", "address", "bio", "avatar_url",
                  "bank_account_sheba", "created_at", "updated_at"]
        read_only_fields = ["id", "user", "created_at", "updated_at"]
        extra_kwargs = {"bank_account_sheba": {"write_only": True}}


class OTPRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False, allow_null=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    purpose = serializers.ChoiceField(choices=OTPPurpose.choices, required=False, default=OTPPurpose.LOGIN)

    def validate(self, attrs):
        if not attrs.get("email") and not attrs.get("phone_number"):
            raise serializers.ValidationError("یکی از فیلدهای ایمیل یا شماره موبایل الزامی است.")
        return attrs


class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField(required=False, allow_null=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    code = serializers.CharField(min_length=6, max_length=6)
    purpose = serializers.ChoiceField(choices=OTPPurpose.choices, required=False, default=OTPPurpose.LOGIN)

    def validate(self, attrs):
        if not attrs.get("email") and not attrs.get("phone_number"):
            raise serializers.ValidationError("یکی از فیلدهای ایمیل یا شماره موبایل الزامی است.")
        return attrs


class AdminUserStatusSerializer(serializers.Serializer):
    is_active = serializers.BooleanField()