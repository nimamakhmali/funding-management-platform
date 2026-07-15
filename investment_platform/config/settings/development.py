"""
تنظیمات محیط توسعه
"""
from .base import *  # noqa: F401, F403

DEBUG = True
SECRET_KEY = "django-insecure-dev-key-change-in-production-!@#$%^&*()"

ALLOWED_HOSTS = ["*"]

# SQLite برای توسعه سریع (بدون نیاز به PostgreSQL)
import os
if os.getenv("DB_ENGINE", "sqlite").lower() in {"sqlite", "sqlite3"}:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",  # noqa: F405
        }
    }

# نمایش کد OTP در response برای توسعه
OTP_DEBUG_MODE = True

# ایمیل در console
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# CORS در توسعه
CORS_ALLOW_ALL_ORIGINS = True

INSTALLED_APPS += ["django.contrib.admindocs"]  # noqa: F405
