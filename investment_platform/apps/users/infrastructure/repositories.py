"""
Repository کاربران
"""
from __future__ import annotations
from typing import Optional

from django.utils import timezone
from .models import OTPCode, User, UserProfile


class UserRepository:
    def get_by_phone(self, phone_number: str) -> User | None:
        return User.objects.filter(phone_number=phone_number).first()

    def exists_by_phone(self, phone_number: str) -> bool:
        return User.objects.filter(phone_number=phone_number).exists()

    def create_user(self, **kwargs) -> User:
        return User.objects.create_user(**kwargs)

    def get_or_create_profile(self, user: User) -> UserProfile:
        profile, _ = UserProfile.objects.get_or_create(user=user)
        return profile

    def get_by_id(self, user_id) -> User | None:
        return User.objects.filter(id=user_id).first()


class OTPRepository:
    def create(self, **kwargs) -> OTPCode:
        return OTPCode.objects.create(**kwargs)

    def get_latest_active(self, user, purpose) -> OTPCode | None:
        return (OTPCode.objects.filter(user=user, purpose=purpose, is_used=False, expires_at__gte=timezone.now())
                .order_by("-created_at").first())

    def get_latest_any(self, user, purpose) -> OTPCode | None:
        return OTPCode.objects.filter(user=user, purpose=purpose).order_by("-created_at").first()