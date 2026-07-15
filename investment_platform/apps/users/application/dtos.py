"""
Data Transfer Objects برای Use Cases کاربران
"""
from dataclasses import dataclass
from typing import Optional


@dataclass
class RegisterUserDTO:
    email: str
    username: str
    password: str
    role: str
    phone_number: Optional[str] = None


@dataclass
class OTPRequestDTO:
    purpose: str
    email: Optional[str] = None
    phone_number: Optional[str] = None


@dataclass
class OTPVerifyDTO:
    code: str
    purpose: str
    email: Optional[str] = None
    phone_number: Optional[str] = None
