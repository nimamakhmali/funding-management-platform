from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from apps.users.infrastructure.models import OTPCode, User, UserProfile


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    extra = 0


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("username", "email", "role", "is_active", "is_verified", "created_at")
    list_filter = ("role", "is_active", "is_staff", "is_verified")
    search_fields = ("username", "email", "phone_number", "national_code")
    ordering = ("-created_at",)
    inlines = [UserProfileInline]
    readonly_fields = ("created_at", "updated_at", "last_login")
    fieldsets = (
        (None, {"fields": ("username", "email", "password")}),
        ("اطلاعات شخصی", {"fields": ("phone_number", "national_code")}),
        ("دسترسی‌ها", {"fields": ("role", "is_active", "is_verified", "is_staff",
                                   "is_superuser", "groups", "user_permissions")}),
        ("تاریخ‌ها", {"fields": ("last_login", "created_at", "updated_at"),
                      "classes": ("collapse",)}),
    )
    add_fieldsets = (
        (None, {"classes": ("wide",),
                "fields": ("username", "email", "password1", "password2", "role")}),
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "company_name", "created_at")
    search_fields = ("user__username", "user__email", "company_name")
    autocomplete_fields = ("user",)
    readonly_fields = ("created_at", "updated_at")


@admin.register(OTPCode)
class OTPCodeAdmin(admin.ModelAdmin):
    list_display = ("user", "purpose", "is_used", "attempt_count", "expires_at", "created_at")
    list_filter = ("purpose", "is_used")
    search_fields = ("user__username", "user__email")
    readonly_fields = ("created_at",)
