"""
Domain Exceptions اختصاصی کاربران
"""
from shared.exceptions import BusinessRuleViolation


class UserAlreadyExists(BusinessRuleViolation):
    def __init__(self, field: str = "ایمیل"):
        super().__init__(f"کاربری با این {field} قبلاً ثبت‌نام کرده است.")


class UserNotFound(BusinessRuleViolation):
    def __init__(self):
        super().__init__("کاربر یافت نشد.")


class WeakPassword(BusinessRuleViolation):
    def __init__(self):
        super().__init__("رمز عبور باید حداقل ۸ کاراکتر باشد.")


from shared.exceptions import DomainException


class OTPInvalidOrExpired(DomainException):
    default_message = "کد تایید نامعتبر یا منقضی شده است."


class OTPAttemptsExceeded(DomainException):
    default_message = "تعداد تلاش مجاز برای این کد به پایان رسیده است. کد جدید درخواست دهید."


class OTPCooldownActive(DomainException):
    default_message = "لطفاً کمی صبر کنید و دوباره تلاش کنید."