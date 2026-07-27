"""
Response envelope استاندارد + Exception Handler سراسری DRF که DomainException ها
را به پاسخ HTTP یکنواخت تبدیل می‌کند. بدون این فایل، هر Use Case باید جداگانه
try/except بنویسد که باعث ناهماهنگی فرمت خطا در کل API می‌شود.
"""
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler

from shared.exceptions import (
    BusinessRuleViolation,
    DomainException,
    ExternalServiceError,
    InsufficientBalanceException,
    InvalidStateTransition,
    NotFoundException,
    PermissionDeniedException,
    RateLimitExceeded,
    ValidationException,
)

_STATUS_MAP = {
    ValidationException: status.HTTP_400_BAD_REQUEST,
    InsufficientBalanceException: status.HTTP_400_BAD_REQUEST,
    InvalidStateTransition: status.HTTP_400_BAD_REQUEST,
    BusinessRuleViolation: status.HTTP_400_BAD_REQUEST,
    NotFoundException: status.HTTP_404_NOT_FOUND,
    PermissionDeniedException: status.HTTP_403_FORBIDDEN,
    ExternalServiceError: status.HTTP_502_BAD_GATEWAY,
    RateLimitExceeded: status.HTTP_429_TOO_MANY_REQUESTS,
}


def success_response(data=None, message: str = "", status_code=status.HTTP_200_OK, **extra):
    payload = {"success": True}
    if message:
        payload["message"] = message
    if data is not None:
        payload["data"] = data
    payload.update(extra)
    return Response(payload, status=status_code)


def error_response(message, status_code=status.HTTP_400_BAD_REQUEST, code: str | None = None):
    return Response({"success": False, "error": message, **({"code": code} if code else {})}, status=status_code)


def custom_exception_handler(exc, context):
    if isinstance(exc, DomainException):
        status_code = _STATUS_MAP.get(type(exc), status.HTTP_400_BAD_REQUEST)
        return error_response(exc.message, status_code=status_code, code=exc.code)

    if isinstance(exc, DjangoValidationError):
        messages = exc.messages if hasattr(exc, "messages") else [str(exc)]
        return error_response(messages, status_code=status.HTTP_400_BAD_REQUEST)

    response = drf_exception_handler(exc, context)
    if response is not None:
        detail = response.data
        if isinstance(detail, dict) and "detail" in detail and len(detail) == 1:
            detail = detail["detail"]
        response.data = {"success": False, "error": detail}
    return response