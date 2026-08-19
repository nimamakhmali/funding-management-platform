"""
Value Objects برای Domain کاربران
"""
from __future__ import annotations
import re
from dataclasses import dataclass


@dataclass(frozen=True)
class Email:
    value: str

    def __post_init__(self):
        if not re.match(r"^[^@]+@[^@]+\.[^@]+$", self.value):
            raise ValueError(f"ایمیل نامعتبر: {self.value}")

    def __str__(self) -> str:
        return self.value


@dataclass(frozen=True)
class PhoneNumber:
    value: str

    def __post_init__(self):
        if not re.match(r"^(\+98|0)?9\d{9}$", self.value):
            raise ValueError(f"شماره موبایل نامعتبر: {self.value}")

    def __str__(self) -> str:
        return self.value


@dataclass(frozen=True)
class NationalCode:
    value: str

    def __post_init__(self):
        if not re.match(r"^\d{10}$", self.value):
            raise ValueError(f"کد ملی نامعتبر: {self.value}")

    def __str__(self) -> str:
        return self.value
