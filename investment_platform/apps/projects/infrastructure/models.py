import uuid

import django
from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models

from apps.projects.domain.state_machine import ProjectStatus
from shared.validators import validate_document_file


def _check_constraint(*, condition, name):
    if django.VERSION >= (5, 0):
        return models.CheckConstraint(condition=condition, name=name)
    return models.CheckConstraint(check=condition, name=name)


class ProjectCategory(models.TextChoices):
    TECHNOLOGY = "TECHNOLOGY", "فناوری"
    AGRICULTURE = "AGRICULTURE", "کشاورزی"
    HEALTH = "HEALTH", "سلامت"
    INDUSTRY = "INDUSTRY", "صنعت"
    SERVICES = "SERVICES", "خدمات"
    OTHER = "OTHER", "سایر"


class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="owned_projects",
        db_index=True,
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=ProjectCategory.choices, default=ProjectCategory.OTHER, db_index=True)

    required_budget = models.DecimalField(max_digits=18, decimal_places=2, validators=[MinValueValidator(0)])
    raised_amount = models.DecimalField(max_digits=18, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    min_investment_amount = models.DecimalField(max_digits=18, decimal_places=2, validators=[MinValueValidator(0)])
    profit_rate_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True,
                                                  help_text="نرخ سود تقریبی سالانه (٪) — برای جستجوی پیشرفته")

    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    status = models.CharField(max_length=32, choices=ProjectStatus.choices, default=ProjectStatus.DRAFT, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "projects"
        indexes = [
            models.Index(fields=["owner"]), models.Index(fields=["status"]),
            models.Index(fields=["category"]), models.Index(fields=["start_date", "end_date"]),
            models.Index(fields=["status", "category"]),
        ]
        constraints = [
            _check_constraint(condition=models.Q(end_date__gt=models.F("start_date")), name="project_end_after_start"),
            _check_constraint(condition=models.Q(raised_amount__lte=models.F("required_budget")), name="project_raised_not_exceed_required"),
        ]

    def __str__(self):
        return f"{self.title} ({self.owner.username})"

    @property
    def funding_percentage(self):
        return (self.raised_amount / self.required_budget) * 100 if self.required_budget else 0

    @property
    def is_funding_complete(self):
        return self.raised_amount >= self.required_budget


class ProjectStatusHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="status_history", db_index=True)
    from_status = models.CharField(max_length=32, null=True, blank=True)
    to_status = models.CharField(max_length=32)
    changed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    reason = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = "project_status_history"
        ordering = ["-created_at"]


class DocumentType(models.TextChoices):
    LEGAL = "LEGAL", "حقوقی"
    FINANCIAL = "FINANCIAL", "مالی"
    TECHNICAL = "TECHNICAL", "فنی"
    OTHER = "OTHER", "سایر"


class Document(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="documents", db_index=True)
    uploader = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=255)
    doc_type = models.CharField(max_length=20, choices=DocumentType.choices, default=DocumentType.OTHER)
    file = models.FileField(upload_to="project_documents/%Y/%m/", validators=[validate_document_file])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "project_documents"
        indexes = [models.Index(fields=["project"])]