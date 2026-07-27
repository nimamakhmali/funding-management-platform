"""
Validators داده‌های ایرانی با الگوریتم‌های چک‌سام رسمی (نه صرفاً بررسی تعداد رقم).
"""
import re

from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def validate_iranian_national_code(value: str) -> None:
    """
    الگوریتم چک‌سام رسمی کد ملی ایران (سازمان ثبت احوال).
    یک regex ساده‌ی «۱۰ رقم» کد ملی‌های نامعتبر مثل 1234567891 را قبول می‌کند؛
    این تابع چک‌سام واقعی را محاسبه می‌کند.
    """
    if not value or not re.match(r"^\d{10}$", value):
        raise ValidationError(_("کد ملی باید دقیقاً ۱۰ رقم باشد."))

    if value == value[0] * 10:
        raise ValidationError(_("کد ملی نامعتبر است."))

    check = int(value[9])
    total = sum(int(value[i]) * (10 - i) for i in range(9))
    remainder = total % 11

    is_valid = (remainder < 2 and check == remainder) or (remainder >= 2 and check == 11 - remainder)
    if not is_valid:
        raise ValidationError(_("کد ملی نامعتبر است (چک‌سام صحیح نیست)."))


def validate_iranian_mobile(value: str) -> None:
    pattern = r"^(?:\+98|0098|0)?9\d{9}$"
    if not value or not re.match(pattern, value):
        raise ValidationError(_("شماره موبایل باید فرمت معتبر ایران داشته باشد (مثال: 09123456789)."))


def normalize_iranian_mobile(value: str) -> str:
    """نرمال‌سازی هر فرمت ورودی به +989xxxxxxxxx (برای ارسال یکنواخت به SMS provider)."""
    digits = re.sub(r"\D", "", value or "")
    if digits.startswith("0098"):
        digits = digits[2:]
    elif digits.startswith("0"):
        digits = "98" + digits[1:]
    elif digits.startswith("9") and not digits.startswith("98"):
        digits = "98" + digits
    return f"+{digits}"


def validate_sheba(value: str) -> None:
    """اعتبارسنجی شماره شبا با الگوریتم MOD-97 (IBAN checksum)."""
    if not value:
        return
    value = value.strip().upper().replace(" ", "")
    if not re.match(r"^IR\d{24}$", value):
        raise ValidationError(_("شماره شبا باید با IR شروع شود و ۲۴ رقم داشته باشد."))
    rearranged = value[4:] + value[:4]
    numeric = "".join(str(int(ch, 36)) for ch in rearranged)
    if int(numeric) % 97 != 1:
        raise ValidationError(_("شماره شبا نامعتبر است (چک‌سام IBAN صحیح نیست)."))
    


ALLOWED_DOCUMENT_EXTENSIONS = {"pdf", "jpg", "jpeg", "png", "doc", "docx"}
MAX_DOCUMENT_SIZE_MB = 10


def validate_document_file(file) -> None:
    ext = file.name.rsplit(".", 1)[-1].lower() if "." in file.name else ""
    if ext not in ALLOWED_DOCUMENT_EXTENSIONS:
        raise ValidationError(
            f"فرمت فایل مجاز نیست. فرمت‌های مجاز: {', '.join(sorted(ALLOWED_DOCUMENT_EXTENSIONS))}"
        )
    if file.size > MAX_DOCUMENT_SIZE_MB * 1024 * 1024:
        raise ValidationError(f"حجم فایل نباید بیشتر از {MAX_DOCUMENT_SIZE_MB} مگابایت باشد.")    