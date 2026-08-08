"""
Data Transfer Objects برای Use Cases کاربران
"""
from dataclasses import dataclass
from typing import Optional


@dataclass
class RegisterUserDTO:
    phone_number: str
    role: str


@dataclass
class OTPRequestDTO:
    phone_number: str


@dataclass
class OTPVerifyDTO:
    code: str
    purpose: str
    phone_number: str


@dataclass
class UpdateProfileDTO:
    company_name: str | None = None
    address: str | None = None
    bio: str | None = None
    avatar_url: str | None = None
    bank_account_sheba: str | None = None


@dataclass
class ResetPasswordDTO:
    phone_number: str
    code: str
    new_password: str


@dataclass
class CompleteIndividualProfileDTO:
    phone_number: str
    first_name: str
    last_name: str
    national_id: str
    date_of_birth: str
    password: str
    password_confirm: str
    contact_number: str
    email: str


@dataclass
class CompleteLegalEntityProfileDTO:
    phone_number: str
    entity_type: str
    company_name_persian: str
    company_name_latin: str
    ceo_name: str
    surname: str
    password: str
    password_confirm: str
    country: str
    province: str
    postal_code: str
    contact_number: str
    email: str
