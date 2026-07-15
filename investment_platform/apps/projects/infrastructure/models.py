"""
Django ORM Models برای پروژه‌ها
"""
import uuid
from decimal import Decimal
from django.core.validators import MinValueValidator
from django.db import models

from apps.projects.domain.state_machine import ProjectStatus


class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        "users.User", on_delete=models.CASCADE, related_name="owned_projects",
        db_index=True,
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=100, db_index=True)
    required_budget = models.DecimalField(
        max_digits=15, decimal_places=2,
        validators=[MinValueValidator(Decimal("0.01"))],
    )
    raised_amount = models.DecimalField(
        max_digits=15, decimal_places=2, default=Decimal("0"),
        validators=[MinValueValidator(Decimal("0"))],
    )
    min_investment_amount = models.DecimalField(
        max_digits=15, decimal_places=2,
        validators=[MinValueValidator(Decimal("0.01"))],
    )
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    status = models.CharField(
        max_length=25,
        choices=ProjectStatus.CHOICES,
        default=ProjectStatus.PENDING_REVIEW,
        db_index=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "projects"
        indexes = [
            models.Index(fields=["owner"]),
            models.Index(fields=["status"]),
            models.Index(fields=["category"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return f"{self.title} ({self.status})"

    @property
    def funding_percentage(self) -> Decimal:
        if not self.required_budget:
            return Decimal("0")
        return (self.raised_amount / self.required_budget * 100).quantize(Decimal("0.01"))

    @property
    def is_funding_complete(self) -> bool:
        return self.raised_amount >= self.required_budget

    @property
    def remaining_budget(self) -> Decimal:
        return self.required_budget - self.raised_amount


class ProjectStatusHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="status_history"
    )
    from_status = models.CharField(max_length=25, null=True, blank=True)
    to_status = models.CharField(max_length=25)
    changed_by = models.ForeignKey(
        "users.User", on_delete=models.SET_NULL, null=True, blank=True,
        related_name="project_status_changes",
    )
    reason = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "project_status_history"
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["project", "created_at"])]


class Document(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="documents")
    uploader = models.ForeignKey(
        "users.User", on_delete=models.SET_NULL, null=True, blank=True,
        related_name="uploaded_documents",
    )
    title = models.CharField(max_length=255)
    file_path = models.CharField(max_length=500)
    file_type = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "documents"

    def __str__(self):
        return f"{self.title} - {self.project.title}"
