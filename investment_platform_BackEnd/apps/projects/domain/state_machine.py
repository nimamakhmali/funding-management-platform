from django.db import models
from shared.exceptions import InvalidStateTransition


class ProjectStatus(models.TextChoices):
    DRAFT = "DRAFT", "پیش‌نویس"
    PENDING_REVIEW = "PENDING_REVIEW", "در انتظار بررسی"
    NEEDS_REVISION = "NEEDS_REVISION", "نیاز به اصلاح"
    APPROVED = "APPROVED", "تایید شده"
    REJECTED = "REJECTED", "رد شده"
    FUNDING = "FUNDING", "در حال جذب سرمایه"
    FUNDING_COMPLETED = "FUNDING_COMPLETED", "تامین مالی تکمیل شد"
    FUNDING_FAILED = "FUNDING_FAILED", "عدم تحقق جذب سرمایه"
    ACTIVE = "ACTIVE", "در حال اجرا"
    PROFIT_CALCULATION = "PROFIT_CALCULATION", "محاسبه سود"
    PROFIT_DISTRIBUTED = "PROFIT_DISTRIBUTED", "توزیع سود"
    COMPLETED = "COMPLETED", "تکمیل شده"
    ARCHIVED = "ARCHIVED", "آرشیو شده"
    CANCELED = "CANCELED", "لغو شده"


# طبق فصل ۴ گزارش فاز اول
ALLOWED_TRANSITIONS: dict[str, set[str]] = {
    ProjectStatus.DRAFT: {ProjectStatus.PENDING_REVIEW, ProjectStatus.CANCELED},
    ProjectStatus.PENDING_REVIEW: {ProjectStatus.APPROVED, ProjectStatus.NEEDS_REVISION, ProjectStatus.REJECTED},
    ProjectStatus.NEEDS_REVISION: {ProjectStatus.PENDING_REVIEW, ProjectStatus.CANCELED},
    ProjectStatus.APPROVED: {ProjectStatus.FUNDING, ProjectStatus.ARCHIVED, ProjectStatus.CANCELED},
    ProjectStatus.FUNDING: {ProjectStatus.FUNDING_COMPLETED, ProjectStatus.FUNDING_FAILED, ProjectStatus.CANCELED},
    ProjectStatus.FUNDING_COMPLETED: {ProjectStatus.ACTIVE, ProjectStatus.CANCELED},
    ProjectStatus.FUNDING_FAILED: {ProjectStatus.ARCHIVED},
    ProjectStatus.ACTIVE: {ProjectStatus.PROFIT_CALCULATION, ProjectStatus.COMPLETED, ProjectStatus.CANCELED},
    ProjectStatus.PROFIT_CALCULATION: {ProjectStatus.PROFIT_DISTRIBUTED},
    ProjectStatus.PROFIT_DISTRIBUTED: {ProjectStatus.COMPLETED},
    ProjectStatus.COMPLETED: set(), ProjectStatus.REJECTED: set(),
    ProjectStatus.ARCHIVED: set(), ProjectStatus.CANCELED: set(),
}

FORCE_ALLOWED_FROM_ANY = {ProjectStatus.CANCELED, ProjectStatus.ARCHIVED}


def validate_transition(from_status: str, to_status: str, *, force: bool = False) -> None:
    if force and to_status in FORCE_ALLOWED_FROM_ANY:
        return
    allowed = ALLOWED_TRANSITIONS.get(from_status, set())
    if to_status not in allowed:
        raise InvalidStateTransition(f"تغییر وضعیت از {from_status} به {to_status} مجاز نیست.")