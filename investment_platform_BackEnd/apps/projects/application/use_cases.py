from __future__ import annotations

from django.db import transaction

from apps.notifications.application.use_cases import create_notification, log_action
from apps.projects.domain.exceptions import ProjectNotFound
from apps.projects.domain.state_machine import ProjectStatus, validate_transition
from apps.projects.infrastructure.models import Project, ProjectStatusHistory
from apps.projects.infrastructure.repositories import ProjectRepository
from shared.exceptions import PermissionDeniedException

_repo = ProjectRepository()


class CreateProjectUseCase:
    def execute(self, *, owner, dto) -> Project:
        project = Project.objects.create(
            owner=owner, title=dto.title, description=dto.description, category=dto.category,
            required_budget=dto.required_budget, min_investment_amount=dto.min_investment_amount,
            start_date=dto.start_date, end_date=dto.end_date,
            profit_rate_percentage=dto.profit_rate_percentage,
            status=ProjectStatus.PENDING_REVIEW, raised_amount=0,
        )
        log_action.execute(actor=owner, action="PROJECT_CREATED", entity="Project", entity_id=str(project.id))
        return project


class ChangeProjectStatusUseCase:
    """تغییر وضعیت توسط اپراتور/ادمین (با بررسی مجوز در ویو انجام می‌شود)."""

    def execute(self, *, actor, project: Project, dto) -> Project:
        with transaction.atomic():
            locked = _repo.for_update(project.id)
            from_status = locked.status
            validate_transition(from_status, dto.to_status)

            locked.status = dto.to_status
            locked.save(update_fields=["status", "updated_at"])

            ProjectStatusHistory.objects.create(
                project=locked, from_status=from_status, to_status=dto.to_status,
                changed_by=actor, reason=dto.reason,
            )
            log_action.execute(
                actor=actor, action="PROJECT_STATUS_CHANGED", entity="Project",
                entity_id=str(locked.id), description=f"{from_status} -> {dto.to_status}",
                metadata={"reason": dto.reason},
            )
            create_notification.execute(
                user=locked.owner, title="تغییر وضعیت طرح",
                message=f"وضعیت طرح «{locked.title}» به «{locked.get_status_display()}» تغییر کرد.",
            )
            return locked


class SystemChangeProjectStatusUseCase:
    """
    تغییر وضعیت خودکار توسط سیستم (نه اقدام مستقیم کاربر)، مثلاً وقتی سرمایه‌گذاری
    باعث تکمیل بودجه می‌شود. توسط دامنه‌های دیگر (investments) فراخوانی می‌شود.
    فرض بر این است که project از قبل توسط فراخواننده select_for_update شده است.
    """

    def execute(self, *, project: Project, to_status: str, reason: str = "") -> Project:
        from_status = project.status
        validate_transition(from_status, to_status)
        project.status = to_status
        project.save(update_fields=["status", "updated_at"])

        ProjectStatusHistory.objects.create(
            project=project, from_status=from_status, to_status=to_status, changed_by=None, reason=reason,
        )
        log_action.execute(
            actor=None, action="PROJECT_STATUS_AUTO_CHANGED", entity="Project",
            entity_id=str(project.id), description=f"{from_status} -> {to_status}: {reason}",
        )
        create_notification.execute(
            user=project.owner, title="تغییر وضعیت طرح",
            message=f"وضعیت طرح «{project.title}» به «{project.get_status_display()}» تغییر کرد.",
        )
        return project


class UploadProjectDocumentUseCase:
    def execute(self, *, project: Project, uploader, title: str, doc_type: str, file):
        from apps.projects.infrastructure.models import Document
        return Document.objects.create(project=project, uploader=uploader, title=title, doc_type=doc_type, file=file)


create_project = CreateProjectUseCase()
change_project_status = ChangeProjectStatusUseCase()
system_change_project_status = SystemChangeProjectStatusUseCase()
upload_project_document = UploadProjectDocumentUseCase()