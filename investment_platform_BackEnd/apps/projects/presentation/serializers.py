from rest_framework import serializers

from apps.projects.infrastructure.models import Document, DocumentType, Project
from apps.projects.domain.state_machine import ProjectStatus
from apps.users.presentation.serializers import UserMinimalSerializer


class DocumentSerializer(serializers.ModelSerializer):
    """سریالایزر اسناد - برای نمایش inline در پروژه"""
    uploader = UserMinimalSerializer(read_only=True)
    file_url = serializers.ReadOnlyField()
    file_size_display = serializers.ReadOnlyField()
    file_extension = serializers.ReadOnlyField()
    doc_type_display = serializers.CharField(
        source="get_doc_type_display", read_only=True
    )

    class Meta:
        model = Document
        fields = [
            "id", "uploader", "title", "doc_type", "doc_type_display",
            "file_url", "file_size_display", "file_extension", "created_at",
        ]
        read_only_fields = ["id", "uploader", "created_at"]


class ProjectSerializer(serializers.ModelSerializer):
    """
    سریالایزر کامل پروژه برای نمایش عمومی و فرانت‌اند.
    شامل تمام فیلدهای مورد نیاز UI.
    """
    owner = UserMinimalSerializer(read_only=True)

    # computed properties از مدل
    funding_percentage = serializers.ReadOnlyField()
    is_funding_complete = serializers.ReadOnlyField()
    remaining_days = serializers.ReadOnlyField()
    investors_count = serializers.ReadOnlyField()
    category_display = serializers.ReadOnlyField()
    cover_image_url = serializers.ReadOnlyField()

    # display fields
    status_display = serializers.CharField(
        source="get_status_display", read_only=True
    )

    # اسناد inline (فقط در retrieve، نه list)
    documents = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            # شناسه و مالک
            "id", "owner",
            # اطلاعات اصلی
            "title", "description", "category", "category_display",
            # تصویر
            "cover_image_url",
            # مالی
            "required_budget", "raised_amount", "min_investment_amount",
            "max_investment_amount", "profit_rate_percentage",
            # زمان‌بندی
            "start_date", "end_date", "remaining_days",
            # وضعیت
            "status", "status_display",
            # محاسباتی
            "funding_percentage", "is_funding_complete", "investors_count",
            # اسناد
            "documents",
            # تاریخ‌ها
            "created_at", "updated_at",
        ]
        read_only_fields = [
            "id", "owner", "raised_amount", "status",
            "funding_percentage", "is_funding_complete",
            "remaining_days", "investors_count",
            "category_display", "cover_image_url",
            "created_at", "updated_at",
        ]

    def get_documents(self, obj) -> list:
        """
        در list view: لیست خالی (برای performance)
        در retrieve view: اسناد کامل
        """
        request = self.context.get("request")
        # اگر action روی detail بود (single object)
        view = self.context.get("view")
        if view and hasattr(view, "action") and view.action == "retrieve":
            docs = obj.documents.all().order_by("created_at")
            return DocumentSerializer(docs, many=True, context=self.context).data
        return []


class ProjectListSerializer(serializers.ModelSerializer):
    """
    سریالایزر سبک برای list view - بدون اسناد و جزئیات اضافه.
    برای performance بهتر در لیست‌های طولانی.
    """
    owner = UserMinimalSerializer(read_only=True)
    funding_percentage = serializers.ReadOnlyField()
    is_funding_complete = serializers.ReadOnlyField()
    remaining_days = serializers.ReadOnlyField()
    investors_count = serializers.ReadOnlyField()
    category_display = serializers.ReadOnlyField()
    cover_image_url = serializers.ReadOnlyField()
    status_display = serializers.CharField(
        source="get_status_display", read_only=True
    )

    class Meta:
        model = Project
        fields = [
            "id", "owner", "title", "description", "category", "category_display",
            "cover_image_url", "required_budget", "raised_amount",
            "min_investment_amount", "profit_rate_percentage",
            "start_date", "end_date", "remaining_days",
            "status", "status_display",
            "funding_percentage", "is_funding_complete", "investors_count",
            "created_at",
        ]


class ProjectCreateSerializer(serializers.ModelSerializer):
    """سریالایزر ایجاد پروژه توسط صاحب طرح"""

    class Meta:
        model = Project
        fields = [
            "title", "description", "category",
            "required_budget", "min_investment_amount", "max_investment_amount",
            "profit_rate_percentage", "start_date", "end_date",
            "cover_image",
        ]

    def validate(self, attrs):
        start = attrs.get("start_date")
        end = attrs.get("end_date")
        if start and end and end <= start:
            raise serializers.ValidationError(
                {"end_date": "تاریخ پایان باید بعد از تاریخ شروع باشد."}
            )
        min_amt = attrs.get("min_investment_amount")
        budget = attrs.get("required_budget")
        if min_amt and budget and min_amt > budget:
            raise serializers.ValidationError(
                {"min_investment_amount": "حداقل سرمایه‌گذاری نمی‌تواند از کل بودجه بیشتر باشد."}
            )
        return attrs


class ProjectStatusChangeSerializer(serializers.Serializer):
    to_status = serializers.ChoiceField(choices=ProjectStatus.choices)
    reason = serializers.CharField(required=False, allow_blank=True)


class DocumentUploadSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    doc_type = serializers.ChoiceField(
        choices=[(t.value, t.label) for t in DocumentType]
    )
    file = serializers.FileField()