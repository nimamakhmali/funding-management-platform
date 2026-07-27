"""
Django settings — Clean/DDD Architecture
هر Bounded Context: apps/<domain>/{domain, application, infrastructure, presentation}
"""
import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(override=True)
BASE_DIR = Path(__file__).resolve().parent.parent


def _env_bool(name, default=False):
    val = os.getenv(name)
    return default if val is None else val.strip().lower() in {"1", "true", "t", "yes", "y", "on"}


def _env_list(name, default=None):
    val = os.getenv(name)
    return default or [] if val is None else [x.strip() for x in val.split(",") if x.strip()]


SECRET_KEY = os.getenv("SECRET_KEY", "django-insecure-CHANGE-ME-IN-PRODUCTION")
DEBUG = _env_bool("DEBUG", True)
ALLOWED_HOSTS = _env_list("ALLOWED_HOSTS", ["localhost", "127.0.0.1"])

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
    "drf_spectacular",
    # --- Local apps (Clean Architecture) ---
    "apps.users.apps.UsersConfig",
    "apps.notifications.apps.NotificationsConfig",
    "apps.projects.apps.ProjectsConfig",
    "apps.investments.apps.InvestmentsConfig",
    "apps.profits.apps.ProfitsConfig",
    "apps.support.apps.SupportConfig",
]

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

TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [BASE_DIR / "templates"],
    "APP_DIRS": True,
    "OPTIONS": {"context_processors": [
        "django.template.context_processors.debug",
        "django.template.context_processors.request",
        "django.contrib.auth.context_processors.auth",
        "django.contrib.messages.context_processors.messages",
    ]},
}]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

DB_ENGINE = os.getenv("DB_ENGINE", "sqlite3").strip().lower()
if DB_ENGINE in {"sqlite", "sqlite3"}:
    DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": os.getenv("SQLITE_NAME", str(BASE_DIR / "db.sqlite3"))}}
else:
    DATABASES = {"default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME", "investment_platform"),
        "USER": os.getenv("DB_USER", "postgres"),
        "PASSWORD": os.getenv("DB_PASSWORD", "postgres"),
        "HOST": os.getenv("DB_HOST", "db"),
        "PORT": os.getenv("DB_PORT", "5432"),
        "CONN_MAX_AGE": int(os.getenv("DB_CONN_MAX_AGE", "60")),
        "OPTIONS": {"connect_timeout": 10},
    }}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator", "OPTIONS": {"min_length": 8}},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_AUTHENTICATION_CLASSES": ("rest_framework_simplejwt.authentication.JWTAuthentication",),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "DEFAULT_THROTTLE_CLASSES": (
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
        "rest_framework.throttling.ScopedRateThrottle",
    ),
    "DEFAULT_THROTTLE_RATES": {
        "anon": os.getenv("THROTTLE_ANON", "120/hour"),
        "user": os.getenv("THROTTLE_USER", "1200/hour"),
        "auth": os.getenv("THROTTLE_AUTH", "20/hour"),
        "otp_request": os.getenv("THROTTLE_OTP_REQUEST", "5/10min"),
        "otp_verify": os.getenv("THROTTLE_OTP_VERIFY", "10/10min"),
    },
    "DEFAULT_PAGINATION_CLASS": "shared.pagination.StandardResultsSetPagination",
    "PAGE_SIZE": int(os.getenv("PAGE_SIZE", "20")),
    "EXCEPTION_HANDLER": "shared.responses.custom_exception_handler",
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=int(os.getenv("JWT_ACCESS_MINUTES", "30"))),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=int(os.getenv("JWT_REFRESH_DAYS", "7"))),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": True,
    "SIGNING_KEY": SECRET_KEY,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

CORS_ALLOWED_ORIGINS = _env_list("CORS_ALLOWED_ORIGINS", ["http://localhost:3000", "http://127.0.0.1:3000"])
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = ["accept", "authorization", "content-type", "origin", "user-agent", "x-csrftoken", "x-requested-with", "x-sejam-secret"]
CSRF_TRUSTED_ORIGINS = _env_list("CSRF_TRUSTED_ORIGINS", [])

SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"
SECURE_REFERRER_POLICY = "same-origin"

if not DEBUG:
    SECURE_HSTS_SECONDS = int(os.getenv("SECURE_HSTS_SECONDS", "31536000"))
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_SSL_REDIRECT = _env_bool("SECURE_SSL_REDIRECT", True)

LANGUAGE_CODE = os.getenv("LANGUAGE_CODE", "fa-ir")
TIME_ZONE = os.getenv("TIME_ZONE", "Asia/Tehran")
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# مدل واقعی در apps/users/infrastructure/models.py است؛
# از طریق apps/users/models.py (re-export) در دسترس Django قرار می‌گیرد.
AUTH_USER_MODEL = "users.User"

FRONTEND_BASE_URL = os.getenv("FRONTEND_BASE_URL", "http://localhost:3000")
BACKEND_PUBLIC_BASE_URL = os.getenv("BACKEND_PUBLIC_BASE_URL", "http://localhost:8000")

OTP_TTL_MINUTES = int(os.getenv("OTP_TTL_MINUTES", "2"))
OTP_MAX_ATTEMPTS = int(os.getenv("OTP_MAX_ATTEMPTS", "5"))
OTP_RESEND_COOLDOWN_SECONDS = int(os.getenv("OTP_RESEND_COOLDOWN_SECONDS", "60"))

SMS_ENABLED = _env_bool("SMS_ENABLED", False)
SMS_PROVIDER = os.getenv("SMS_PROVIDER", "kavenegar")
SMS_KAVENEGAR_API_KEY = os.getenv("SMS_KAVENEGAR_API_KEY", "")
SMS_KAVENEGAR_TEMPLATE = os.getenv("SMS_KAVENEGAR_TEMPLATE", "verify")
SMS_FARAZSMS_BASE_URL = os.getenv("SMS_FARAZSMS_BASE_URL", "")
SMS_FARAZSMS_API_KEY = os.getenv("SMS_FARAZSMS_API_KEY", "")
SMS_FARAZSMS_SENDER = os.getenv("SMS_FARAZSMS_SENDER", "")

SEJAM_ENABLED = _env_bool("SEJAM_ENABLED", False)
SEJAM_BASE_URL = os.getenv("SEJAM_BASE_URL", "")
SEJAM_API_KEY = os.getenv("SEJAM_API_KEY", "")
SEJAM_TIMEOUT_SECONDS = int(os.getenv("SEJAM_TIMEOUT_SECONDS", "20"))
SEJAM_CALLBACK_SECRET = os.getenv("SEJAM_CALLBACK_SECRET", "")

FIELD_ENCRYPTION_KEY = os.getenv("FIELD_ENCRYPTION_KEY", "")

SPECTACULAR_SETTINGS = {
    "TITLE": "سامانه مدیریت سرمایه‌گذاری — API",
    "DESCRIPTION": "مستندات کامل REST API v1 برای فرانت‌اند React. پایه: `/api/v1/`. هدر: `Authorization: Bearer <token>`.",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "COMPONENT_SPLIT_REQUEST": True,
    "SCHEMA_PATH_PREFIX": r"/api/v1/",
    "TAGS": [
        {"name": "Auth", "description": "ثبت‌نام، JWT و OTP"},
        {"name": "Profile", "description": "پروفایل کاربر"},
        {"name": "Projects", "description": "مدیریت پروژه‌های جذب سرمایه"},
        {"name": "Wallet", "description": "کیف پول و درگاه پرداخت"},
        {"name": "Transactions", "description": "تاریخچه تراکنش‌ها"},
        {"name": "Investments", "description": "سرمایه‌گذاری"},
        {"name": "Profit", "description": "توزیع سود و تسویه سجام"},
        {"name": "Tickets", "description": "پشتیبانی"},
        {"name": "Notifications", "description": "اعلان‌های داخلی"},
        {"name": "Admin", "description": "پنل مدیریت، کاربران، لاگ ممیزی، تنظیمات درگاه"},
    ],
    "SECURITY": [{"bearerAuth": []}],
    "APPEND_COMPONENTS": {"securitySchemes": {"bearerAuth": {"type": "http", "scheme": "bearer", "bearerFormat": "JWT"}}},
    "SWAGGER_UI_SETTINGS": {"deepLinking": True, "persistAuthorization": True, "displayRequestDuration": True, "filter": True},
}

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {"verbose": {"format": "[{asctime}] {levelname} {name}: {message}", "style": "{"}},
    "handlers": {"console": {"class": "logging.StreamHandler", "formatter": "verbose"}},
    "root": {"handlers": ["console"], "level": os.getenv("LOG_LEVEL", "INFO")},
}