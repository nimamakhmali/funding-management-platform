from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .infrastructure.models import OTPCode, User, UserProfile


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    extra = 0


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("username", "phone_number", "role", "is_active", "is_staff", "phone_verified", "created_at")
    list_filter = ("role", "is_active", "is_staff")
    search_fields = ("username", "phone_number", "national_code")
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at", "last_login")
    inlines = (UserProfileInline,)
    fieldsets = (
        (None, {"fields": ("username", "phone_number", "password")}),
        ("اطلاعات فردی", {"fields": ("email", "national_code", "phone_verified")}),
        ("دسترسی‌ها", {"fields": ("role", "is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("تاریخ‌ها", {"fields": ("last_login", "created_at", "updated_at")}),
    )
    add_fieldsets = ((None, {"classes": ("wide",), "fields": ("username", "phone_number", "password1", "password2", "role")}),)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "company_name", "created_at")
    search_fields = ("user__username", "company_name")
    autocomplete_fields = ("user",)


@admin.register(OTPCode)
class OTPCodeAdmin(admin.ModelAdmin):
    list_display = ("user", "purpose", "is_used", "attempts", "expires_at")
    list_filter = ("purpose", "is_used")
    autocomplete_fields = ("user",)
    readonly_fields = ("code", "created_at")