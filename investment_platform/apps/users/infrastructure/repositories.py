"""
Repository کاربران
"""
from __future__ import annotations
from typing import Optional
from apps.users.infrastructure.models import User


class UserRepository:
    def get_by_email(self, email: str) -> Optional[User]:
        return User.objects.filter(email=email).first()

    def get_by_phone(self, phone_number: str) -> Optional[User]:
        return User.objects.filter(phone_number=phone_number).first()


from django.utils import timezone
from .models import OTPCode, User, UserProfile


class UserRepository:
    def get_by_email(self, email: str) -> User | None:
        return User.objects.filter(email__iexact=email).first()

    def get_by_phone(self, phone_number: str) -> User | None:
        return User.objects.filter(phone_number=phone_number).first()

    def exists_email_or_phone(self, email: str, phone_number: str | None) -> bool:
        from django.db.models import Q
        q = Q(email__iexact=email)
        if phone_number:
            q |= Q(phone_number=phone_number)
        return User.objects.filter(q).exists()

    def create_user(self, **kwargs) -> User:
        return User.objects.create_user(**kwargs)

    def get_or_create_profile(self, user: User) -> UserProfile:
        profile, _ = UserProfile.objects.get_or_create(user=user)
        return profile
    
    def get_by_id(self, user_id) -> Optional[User]:
        return User.objects.filter(id=user_id).first()

    def exists_by_email(self, email: str) -> bool:
        return User.objects.filter(email=email).exists()


class OTPRepository:
    def create(self, **kwargs) -> OTPCode:
        return OTPCode.objects.create(**kwargs)

    def get_latest_active(self, user, purpose) -> OTPCode | None:
        return (OTPCode.objects.filter(user=user, purpose=purpose, is_used=False, expires_at__gte=timezone.now())
                .order_by("-created_at").first())

    def get_latest_any(self, user, purpose) -> OTPCode | None:
        return OTPCode.objects.filter(user=user, purpose=purpose).order_by("-created_at").first()