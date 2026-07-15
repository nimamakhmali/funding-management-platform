"""
تنظیمات پایه - مشترک بین همه محیط‌ها
"""
import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(override=True)

BASE_DIR = Path(__file__).resolve().parent.parent.parent


def env_bool(key: str, default: bool = False) -> bool:
    val = os.getenv(key, "").strip().lower()
    return val in {"1", "true", "yes", "on"} if val else default


def env_list(key: str, default: list[str] | None = None) -> list[str]:
    val = os.getenv(key, "")
    return [x.strip() for x in val.split(",") if x.strip()] if val else (default or [])


SECRET_KEY = os.environ.get("SECRET_KEY", "change-me-in-production")
DEBUG = False
ALLOWED_HOSTS: list[str] = env_list("ALLOWED_HOSTS", [])

DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS = [
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
    "drf_spectacular",
]

LOCAL_APPS = [
    "apps.users",
    "apps.projects",
    "apps.investments",
    "apps.profits",
    "apps.support",
    "apps.notifications",
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"
AUTH_USER_MODEL = "users.User"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ]
        },
    }
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME", "investment_platform"),
        "USER": os.getenv("DB_USER", "postgres"),
        "PASSWORD": os.getenv("DB_PASSWORD", "postgres"),
        "HOST": os.getenv("DB_HOST", "localhost"),
        "PORT": os.getenv("DB_PORT", "5432"),
        "OPTIONS": {"connect_timeout": 10},
        "CONN_MAX_AGE": 60,
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
     "OPTIONS": {"min_length": 8}},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_PAGINATION_CLASS": "shared.pagination.StandardPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
        "rest_framework.throttling.ScopedRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": os.getenv("THROTTLE_ANON", "100/hour"),
        "user": os.getenv("THROTTLE_USER", "1000/hour"),
        "auth": os.getenv("THROTTLE_AUTH", "10/hour"),
        "otp": os.getenv("THROTTLE_OTP", "5/hour"),
    },
    "EXCEPTION_HANDLER": "shared.exceptions.custom_exception_handler",
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=int(os.getenv("JWT_ACCESS_MINUTES", "30"))),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=int(os.getenv("JWT_REFRESH_DAYS", "7"))),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

CORS_ALLOWED_ORIGINS = env_list(
    "CORS_ALLOWED_ORIGINS",
    ["http://localhost:3000", "http://127.0.0.1:3000"],
)
CORS_ALLOW_CREDENTIALS = True

LANGUAGE_CODE = os.getenv("LANGUAGE_CODE", "fa-ir")
TIME_ZONE = os.getenv("TIME_ZONE", "Asia/Tehran")
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# OTP
OTP_TTL_MINUTES = int(os.getenv("OTP_TTL_MINUTES", "5"))
OTP_MAX_ATTEMPTS = int(os.getenv("OTP_MAX_ATTEMPTS", "3"))

# SMS
SMS_ENABLED = env_bool("SMS_ENABLED", False)
SMS_PROVIDER = os.getenv("SMS_PROVIDER", "none").lower()
SMS_KAVENEGAR_API_KEY = os.getenv("SMS_KAVENEGAR_API_KEY", "")
SMS_KAVENEGAR_TEMPLATE = os.getenv("SMS_KAVENEGAR_TEMPLATE", "")
SMS_FARAZSMS_BASE_URL = os.getenv("SMS_FARAZSMS_BASE_URL", "")
SMS_FARAZSMS_API_KEY = os.getenv("SMS_FARAZSMS_API_KEY", "")
SMS_FARAZSMS_SENDER = os.getenv("SMS_FARAZSMS_SENDER", "")

# SEJAM
SEJAM_ENABLED = env_bool("SEJAM_ENABLED", False)
SEJAM_BASE_URL = os.getenv("SEJAM_BASE_URL", "")
SEJAM_API_KEY = os.getenv("SEJAM_API_KEY", "")
SEJAM_TIMEOUT_SECONDS = int(os.getenv("SEJAM_TIMEOUT_SECONDS", "20"))

SPECTACULAR_SETTINGS = {
    "TITLE": "سامانه مدیریت سرمایه‌گذاری — API",
    "DESCRIPTION": (
        "مستندات کامل REST API نسخه ۱ (v1). "
        "پایهٔ مسیرها: /api/v1/. "
        "برای endpointهای محافظت‌شده هدر Authorization: Bearer <access_token> ارسال شود."
    ),
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "SCHEMA_PATH_PREFIX": r"/api/v1/",
    "COMPONENT_SPLIT_REQUEST": True,
    "SORT_OPERATIONS": False,
    "TAGS": [
        {"name": "Auth", "description": "ثبت‌نام، JWT و OTP"},
        {"name": "Profile", "description": "پروفایل کاربر"},
        {"name": "Projects", "description": "مدیریت پروژه‌های جذب سرمایه"},
        {"name": "Wallet", "description": "کیف پول، واریز و برداشت"},
        {"name": "Transactions", "description": "تاریخچه تراکنش‌ها"},
        {"name": "Investments", "description": "سرمایه‌گذاری"},
        {"name": "Profit", "description": "دوره سود (ادمین)"},
        {"name": "Tickets", "description": "تیکت پشتیبانی"},
        {"name": "Notifications", "description": "اعلان‌های داخلی"},
        {"name": "Admin", "description": "مدیریت کاربران و لاگ"},
    ],
}

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {process:d} {thread:d} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
        "apps": {
            "handlers": ["console"],
            "level": "DEBUG",
            "propagate": False,
        },
    },
}
