"""
یک نکته امنیتی مهم: throttle پیش‌فرض DRF بر اساس IP کار می‌کند. یعنی مهاجم با چند IP
مختلف (که به‌سادگی با پروکسی قابل دور زدن است) هنوز می‌تواند یک شماره موبایل خاص را
بمباران OTP کند. این کلاس‌ها throttle را روی ترکیب IP + شماره هدف اعمال می‌کنند.
"""
from rest_framework.throttling import ScopedRateThrottle


class AuthRateThrottle(ScopedRateThrottle):
    scope = "auth"


class _IdentityAwareThrottle(ScopedRateThrottle):
    def get_cache_key(self, request, view):
        identity = (request.data.get("phone_number") or "").strip().lower()
        if not identity:
            return super().get_cache_key(request, view)
        ident = self.get_ident(request)
        return self.cache_format % {"scope": self.scope, "ident": f"{ident}:{identity}"}


class OTPRequestThrottle(_IdentityAwareThrottle):
    scope = "otp_request"


class OTPVerifyThrottle(_IdentityAwareThrottle):
    scope = "otp_verify"