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
