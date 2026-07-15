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

    def get_by_id(self, user_id) -> Optional[User]:
        return User.objects.filter(id=user_id).first()

    def exists_by_email(self, email: str) -> bool:
        return User.objects.filter(email=email).exists()
