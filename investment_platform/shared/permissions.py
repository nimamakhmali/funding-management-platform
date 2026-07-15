"""
Permission های مشترک DRF
"""
from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):
    """فقط ادمین"""
    message = "فقط مدیران سامانه دسترسی دارند."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.is_staff or request.user.role == "ADMIN")
        )


class IsInvestor(BasePermission):
    """فقط سرمایه‌گذار"""
    message = "فقط سرمایه‌گذاران می‌توانند این عملیات را انجام دهند."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "INVESTOR"
        )


class IsEntrepreneur(BasePermission):
    """فقط کارآفرین / صاحب طرح"""
    message = "فقط کارآفرینان می‌توانند این عملیات را انجام دهند."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in {"ENTREPRENEUR", "PROJECT_OWNER"}
        )


class IsOwnerOrAdmin(BasePermission):
    """صاحب آبجکت یا ادمین"""
    message = "فقط صاحب این منبع یا مدیران دسترسی دارند."

    def has_object_permission(self, request, view, obj):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.is_staff or request.user.role == "ADMIN":
            return True
        owner_id = (
            getattr(obj, "owner_id", None)
            or getattr(obj, "user_id", None)
            or getattr(obj, "investor_id", None)
        )
        return owner_id == request.user.id


class IsAuthenticatedOrReadOnly(BasePermission):
    """احراز هویت برای نوشتن، خواندن برای همه"""
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated)
