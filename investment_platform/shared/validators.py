"""
Validator های مشترک
"""
import re
from django.core.exceptions import ValidationError


def validate_iranian_phone(value: str) -> None:
    pattern = r"^(\+98|0)?9\d{9}$"
    if not re.match(pattern, value):
        raise ValidationError(
            "شماره موبایل معتبر نیست. فرمت صحیح: 09xxxxxxxxx"
        )


def validate_national_code(value: str) -> None:
    if not re.match(r"^\d{10}$", value):
        raise ValidationError("کد ملی باید ۱۰ رقم عددی باشد.")


def validate_iban(value: str) -> None:
    """اعتبارسنجی شماره شبا ایران"""
    cleaned = value.replace(" ", "").upper()
    if not re.match(r"^IR\d{24}$", cleaned):
        raise ValidationError("شماره شبا معتبر نیست. فرمت: IR + 24 رقم")
