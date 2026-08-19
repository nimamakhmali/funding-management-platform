"""
Permission های مشترک DRF
"""
from rest_framework.permissions import BasePermission, SAFE_METHODS


def _role(user):
    return getattr(user, "role", None)


def is_admin(user) -> bool:
    return bool(user.is_superuser or _role(user) == "ADMIN")


def is_operator(user) -> bool:
    return user.groups.filter(name="Operators").exists()


def is_observer(user) -> bool:
    return user.groups.filter(name="Observers").exists()




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



class IsProjectOwnerOrAdmin(IsOwnerOrAdmin):
    owner_field = "owner_id"


class IsTicketOwnerOrAdmin(IsOwnerOrAdmin):
    owner_field = "user_id"


class IsOperatorOrAdmin(BasePermission):
    """اپراتور: بررسی مدارک/تیکت‌ها/تغییر وضعیت طرح/محاسبه سود — بدون دسترسی مالی نهایی."""
    message = "دسترسی فقط برای اپراتور یا مدیر سامانه مجاز است."

    def has_permission(self, request, view):
        u = request.user
        return bool(u and u.is_authenticated and (is_admin(u) or is_operator(u)))


class IsObserverOrAbove(BasePermission):
    """ناظر: فقط خواندن. اپراتور/ادمین: خواندن+نوشتن."""
    message = "ناظر صرفاً دسترسی مشاهده دارد."

    def has_permission(self, request, view):
        u = request.user
        if not (u and u.is_authenticated):
            return False
        if is_admin(u) or is_operator(u):
            return True
        return is_observer(u) and request.method in SAFE_METHODS


class IsAdminRoleOnly(BasePermission):
    """فقط مدیر واقعی — برای عملیات حیاتی مالی (تسویه سجام، تنظیمات درگاه پرداخت)."""
    message = "این عملیات فقط برای مدیر سامانه مجاز است."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and is_admin(request.user))