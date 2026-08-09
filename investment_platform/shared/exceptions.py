"""
Exception های مشترک - Domain + DRF Handler
"""
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler


# ---------------------------------------------------------------------------
# Base Domain Exceptions
# ---------------------------------------------------------------------------

class DomainException(Exception):
    default_message = "خطای دامنه رخ داده است."

    def __init__(self, message: str | None = None, *, code: str | None = None):
        self.message = message or self.default_message
        self.code = code or self.__class__.__name__
        super().__init__(self.message)


class ValidationException(DomainException):
    default_message = "داده‌های ورودی نامعتبر است."


class NotFoundException(DomainException):
    default_message = "منبع مورد نظر یافت نشد."


class PermissionDeniedException(DomainException):
    default_message = "شما اجازه‌ی انجام این عملیات را ندارید."


class InsufficientBalanceException(DomainException):
    default_message = "موجودی کافی نیست."



class ExternalServiceError(DomainException):
    """خطای ارتباط با سرویس بیرونی (پیامک، درگاه پرداخت، سجام)."""
    default_message = "ارتباط با سرویس بیرونی با خطا مواجه شد."


class RateLimitExceeded(DomainException):
    default_message = "تعداد درخواست‌های شما بیش از حد مجاز است."

class BusinessRuleViolation(DomainException):
    """نقض قانون بیزینس"""
    def __init__(self, message: str):
        super().__init__(message, code="business_rule_violation")  # ✅ اضافه کردن code=

class ResourceNotFound(DomainException):
    def __init__(self, resource: str, identifier: str = ""):
        msg = f"{resource} یافت نشد."
        if identifier:
            msg = f"{resource} با شناسه «{identifier}» یافت نشد."
        super().__init__(msg, code="not_found")  # ✅

class PermissionDenied(DomainException):
    def __init__(self, message: str = "دسترسی غیرمجاز است."):
        super().__init__(message, code="permission_denied")  # ✅
        
        
# ---------------------------------------------------------------------------
# Specific Domain Exceptions
# ---------------------------------------------------------------------------

class InsufficientBalance(BusinessRuleViolation):
    def __init__(self):
        super().__init__("موجودی کیف پول کافی نیست.")


class InvalidOTP(BusinessRuleViolation):
    def __init__(self):
        super().__init__("کد تأیید نامعتبر یا منقضی شده است.")


class OTPMaxAttemptsExceeded(BusinessRuleViolation):
    def __init__(self):
        super().__init__("تعداد تلاش‌های مجاز تمام شد. لطفاً کد جدید درخواست کنید.")


class InvalidStateTransition(BusinessRuleViolation):
    def __init__(self, from_state: str, to_state: str):
        super().__init__(
            f"انتقال از وضعیت «{from_state}» به «{to_state}» مجاز نیست."
        )


class DuplicateInvestment(BusinessRuleViolation):
    def __init__(self):
        super().__init__("شما قبلاً در این پروژه سرمایه‌گذاری فعال دارید.")


class ProjectNotInvestable(BusinessRuleViolation):
    def __init__(self):
        super().__init__("این پروژه در وضعیت قابل سرمایه‌گذاری نیست.")


# ---------------------------------------------------------------------------
# DRF Custom Exception Handler
# ---------------------------------------------------------------------------

def custom_exception_handler(exc, context):
    """
    Handler یکپارچه برای تمام خطاها.
    فرمت خروجی استاندارد:
        {"error": "پیام خطا", "code": "error_code"}
    """
    if isinstance(exc, ResourceNotFound):
        return Response(
            {"error": exc.message, "code": exc.code},
            status=status.HTTP_404_NOT_FOUND,
        )

    if isinstance(exc, PermissionDenied):
        return Response(
            {"error": exc.message, "code": exc.code},
            status=status.HTTP_403_FORBIDDEN,
        )

    if isinstance(exc, DomainException):
        return Response(
            {"error": exc.message, "code": exc.code},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if isinstance(exc, DjangoValidationError):
        messages = exc.messages if hasattr(exc, "messages") else [str(exc)]
        return Response(
            {"error": messages[0] if len(messages) == 1 else messages,
             "code": "validation_error"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    return exception_handler(exc, context)
