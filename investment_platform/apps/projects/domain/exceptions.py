from shared.exceptions import BusinessRuleViolation, InvalidStateTransition, NotFoundException

__all__ = ["InvalidStateTransition", "BusinessRuleViolation", "ProjectNotFound", "ProjectNotApproved"]


class ProjectNotFound(NotFoundException):
    default_message = "پروژه یافت نشد."


class ProjectNotApproved(BusinessRuleViolation):
    default_message = "این عملیات فقط برای پروژه‌های تایید شده مجاز است."