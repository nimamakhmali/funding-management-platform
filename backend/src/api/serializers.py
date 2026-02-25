from rest_framework import serializers
from funding.models import (
    Document,
    Investment,
    PayoutItem,
    ProfitPeriod,
    Project,
    Ticket,
    Transaction,
    User,
    UserProfile,
    Wallet,
    ProjectStatus,
)

class UserMinimalSerializer(serializers.ModelSerializer):
    """
    نمایش مینیمال کاربر برای استفاده در سریالایزرهای تو در تو
    """

    class Meta:
        model = User
        fields = ["id", "username", "email"]
        read_only_fields = ["id"]


class UserSerializer(serializers.ModelSerializer):
    """
    برای نمایش اطلاعات عمومی کاربر (Read-Only در اکثر موارد)
    """
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "phone_number",
            "role",
            "national_code",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["id", "is_active", "created_at", "role"]  # نقش نباید توسط خود کاربر عوض شود


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    مخصوص ثبت‌نام کاربر: مدیریت پسورد و تایید آن
    """
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ["username", "email", "phone_number", "role", "password", "password_confirm"]

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        # استفاده از متد create_user برای هش کردن پسورد
        user = User.objects.create_user(**validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    # استفاده از نسخه مینیمال برای جلوگیری از نمایش فیلدهای حساس یوزر
    user = UserMinimalSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            "id",
            "user",
            "company_name",
            "address",
            "bio",
            "avatar_url",
            "bank_account_number",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


# ============================================================================
# PROJECT SERIALIZERS
# ============================================================================

class ProjectSerializer(serializers.ModelSerializer):
    """
    برای نمایش کامل پروژه (Read)
    """
    owner = UserMinimalSerializer(read_only=True)
    # خواندن مستقیم پراپرتی از مدل
    funding_percentage = serializers.ReadOnlyField()
    is_funding_complete = serializers.ReadOnlyField()

    class Meta:
        model = Project
        fields = [
            "id",
            "owner",
            "title",
            "description",
            "category",
            "required_budget",
            "raised_amount",
            "min_investment_amount",
            "start_date",
            "end_date",
            "status",
            "funding_percentage",
            "is_funding_complete",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "raised_amount",
            "status", # وضعیت فقط توسط ادمین تغییر میکند
            "funding_percentage",
            "is_funding_complete",
            "created_at",
            "updated_at",
        ]


class ProjectCreateSerializer(serializers.ModelSerializer):
    """
    مخصوص ایجاد پروژه توسط کارآفرین (فیلدهای کمتر)
    """
    class Meta:
        model = Project
        fields = [
            "title",
            "description",
            "category",
            "required_budget",
            "min_investment_amount",
            "start_date",
            "end_date",
        ]
    
    def validate(self, attrs):
        # اعتبارسنجی تاریخ‌ها
        if attrs['end_date'] <= attrs['start_date']:
            raise serializers.ValidationError("End date must be after start date.")
        return attrs


# ============================================================================
# INVESTMENT SERIALIZERS
# ============================================================================

class InvestmentSerializer(serializers.ModelSerializer):
    """
    برای نمایش سرمایه‌گذاری (Read) - با جزئیات کامل
    """
    investor = UserMinimalSerializer(read_only=True)
    project_title = serializers.CharField(source="project.title", read_only=True)
    project_id = serializers.UUIDField(source="project.id", read_only=True)

    class Meta:
        model = Investment
        fields = [
            "id",
            "investor",
            "project_id",
            "project_title",
            "amount",
            "invest_date",
            "status",
            "contract_file_url",
            "created_at",
        ]


class InvestmentCreateSerializer(serializers.ModelSerializer):
    """
    مخصوص ثبت سرمایه‌گذاری جدید (Write)
    """
    # دریافت ID پروژه و تبدیل خودکار به آبجکت
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())
    amount = serializers.DecimalField(max_digits=15, decimal_places=2)

    class Meta:
        model = Investment
        fields = ["project", "amount"]

    def validate(self, attrs):
        user = self.context["request"].user
        project = attrs["project"]
        amount = attrs["amount"]

        # 1. بررسی وضعیت پروژه (فقط پروژه‌های تایید شده)
        if project.status != ProjectStatus.APPROVED:
            raise serializers.ValidationError(
                "سرمایه‌گذاری فقط روی پروژه‌های تایید شده امکان‌پذیر است."
            )

        # 2. بررسی حداقل مبلغ سرمایه‌گذاری
        if amount < project.min_investment_amount:
            raise serializers.ValidationError(f"Minimum investment amount is {project.min_investment_amount}")

        # 3. بررسی مانده بودجه
        remaining = project.required_budget - project.raised_amount
        if amount > remaining:
            raise serializers.ValidationError(f"Investment exceeds remaining budget ({remaining})")

        # 4. بررسی موجودی کیف پول کاربر (چک اولیه – منطق اصلی در Service Layer)
        if not hasattr(user, "wallet"):
            raise serializers.ValidationError("User does not have a wallet.")
        
        if user.wallet.available_balance < amount:
            raise serializers.ValidationError("Insufficient wallet balance.")

        return attrs

    def create(self, validated_data):
        # منطق دقیق کسر از کیف پول باید در Service Layer انجام شود؛
        # اینجا فقط رکورد Investment ساخته می‌شود.
        user = self.context["request"].user
        project = validated_data["project"]
        return Investment.objects.create(
            investor=user,
            project=project,
            amount=validated_data["amount"],
        )


# ============================================================================
# FINANCIAL & OTHERS
# ============================================================================

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = "__all__"
        read_only_fields = ["id", "created_at", "user", "is_successful"]


class WalletSerializer(serializers.ModelSerializer):
    available_balance = serializers.ReadOnlyField()

    class Meta:
        model = Wallet
        fields = [
            "balance",
            "blocked_amount",
            "available_balance",
            "updated_at",
        ]
        # هرگونه تغییر روی کیف پول فقط باید از طریق لایه Service و تراکنش‌ها انجام شود
        read_only_fields = ["balance", "blocked_amount", "available_balance", "updated_at"]


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = "__all__"
        read_only_fields = ["id", "created_at", "uploader"]


class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at", "user", "status"] 
        # کاربر نباید بتواند موقع ساخت تیکت، وضعیت را تغییر دهد


class ProfitPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfitPeriod
        fields = "__all__"


class PayoutItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayoutItem
        fields = "__all__"