"""
State Machine وضعیت پروژه
"""
from shared.exceptions import InvalidStateTransition


class ProjectStatus:
    DRAFT = "DRAFT"
    PENDING_REVIEW = "PENDING_REVIEW"
    NEEDS_REVISION = "NEEDS_REVISION"
    APPROVED = "APPROVED"
    FUNDING = "FUNDING"
    FUNDING_COMPLETED = "FUNDING_COMPLETED"
    FUNDING_FAILED = "FUNDING_FAILED"
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    REJECTED = "REJECTED"
    CANCELLED = "CANCELLED"
    ARCHIVED = "ARCHIVED"

    CHOICES = [
        (DRAFT, "پیش‌نویس"),
        (PENDING_REVIEW, "در انتظار بررسی"),
        (NEEDS_REVISION, "نیاز به اصلاح"),
        (APPROVED, "تأیید شده"),
        (FUNDING, "در حال جذب سرمایه"),
        (FUNDING_COMPLETED, "تأمین مالی کامل"),
        (FUNDING_FAILED, "جذب ناموفق"),
        (ACTIVE, "در حال اجرا"),
        (COMPLETED, "تکمیل شده"),
        (REJECTED, "رد شده"),
        (CANCELLED, "لغو شده"),
        (ARCHIVED, "آرشیو"),
    ]

    INVESTABLE = {APPROVED, FUNDING}
    TERMINAL = {COMPLETED, REJECTED, CANCELLED}


TRANSITION_MATRIX: dict[str, set[str]] = {
    ProjectStatus.DRAFT: {ProjectStatus.PENDING_REVIEW, ProjectStatus.CANCELLED},
    ProjectStatus.PENDING_REVIEW: {
        ProjectStatus.APPROVED,
        ProjectStatus.REJECTED,
        ProjectStatus.NEEDS_REVISION,
    },
    ProjectStatus.NEEDS_REVISION: {ProjectStatus.PENDING_REVIEW, ProjectStatus.CANCELLED},
    ProjectStatus.APPROVED: {
        ProjectStatus.FUNDING,
        ProjectStatus.ARCHIVED,
        ProjectStatus.CANCELLED,
    },
    ProjectStatus.FUNDING: {
        ProjectStatus.FUNDING_COMPLETED,
        ProjectStatus.FUNDING_FAILED,
        ProjectStatus.CANCELLED,
    },
    ProjectStatus.FUNDING_COMPLETED: {ProjectStatus.ACTIVE},
    ProjectStatus.FUNDING_FAILED: {ProjectStatus.ARCHIVED},
    ProjectStatus.ACTIVE: {ProjectStatus.COMPLETED, ProjectStatus.ARCHIVED},
    ProjectStatus.COMPLETED: set(),
    ProjectStatus.REJECTED: set(),
    ProjectStatus.CANCELLED: set(),
    ProjectStatus.ARCHIVED: set(),
}


def validate_transition(from_status: str, to_status: str) -> None:
    allowed = TRANSITION_MATRIX.get(from_status, set())
    if to_status not in allowed:
        raise InvalidStateTransition(from_status, to_status)
