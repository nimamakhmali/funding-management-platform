"""
Throttle های اختصاصی
"""
from rest_framework.throttling import ScopedRateThrottle


class AuthThrottle(ScopedRateThrottle):
    scope = "auth"


class OTPThrottle(ScopedRateThrottle):
    scope = "otp"
