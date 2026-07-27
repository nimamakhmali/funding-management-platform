from rest_framework import serializers

from apps.projects.infrastructure.models import Document, Project
from apps.projects.domain.state_machine import ProjectStatus
from apps.users.presentation.serializers import UserMinimalSerializer


class ProjectSerializer(serializers.ModelSerializer):
    owner = UserMinimalSerializer(read_only=True)
    funding_percentage = serializers.ReadOnlyField()
    is_funding_complete = serializers.ReadOnlyField()
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Project
        fields = [
            "id", "owner", "title", "description", "category", "required_budget", "raised_amount",
            "min_investment_amount", "profit_rate_percentage", "start_date", "end_date",
            "status", "status_display", "funding_percentage", "is_funding_complete",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "owner", "raised_amount", "status", "funding_percentage",
                             "is_funding_complete", "created_at", "updated_at"]


class ProjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["title", "description", "category", "required_budget", "min_investment_amount",
                  "profit_rate_percentage", "start_date", "end_date"]

    def validate(self, attrs):
        start = attrs.get("start_date")
        end = attrs.get("end_date")
        if start and end and end <= start:
            raise serializers.ValidationError("تاریخ پایان باید بعد از تاریخ شروع باشد.")
        min_amt = attrs.get("min_investment_amount")
        budget = attrs.get("required_budget")
        if min_amt and budget and min_amt > budget:
            raise serializers.ValidationError("حداقل سرمایه‌گذاری نمی‌تواند از کل بودجه بیشتر باشد.")
        return attrs


class ProjectStatusChangeSerializer(serializers.Serializer):
    to_status = serializers.ChoiceField(choices=ProjectStatus.choices)
    reason = serializers.CharField(required=False, allow_blank=True)


class DocumentSerializer(serializers.ModelSerializer):
    uploader = UserMinimalSerializer(read_only=True)

    class Meta:
        model = Document
        fields = ["id", "project", "uploader", "title", "doc_type", "file", "created_at"]
        read_only_fields = ["id", "project", "uploader", "created_at"]


class DocumentUploadSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    doc_type = serializers.ChoiceField(choices=[("LEGAL", ""), ("FINANCIAL", ""), ("TECHNICAL", ""), ("OTHER", "")])
    file = serializers.FileField()