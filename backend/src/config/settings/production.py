"""
Production environment settings

This file contains settings specific to the production environment.
IMPORTANT: Review all security settings before deploying to production!
"""
from .base import *
import os

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',') if os.getenv('ALLOWED_HOSTS') else []

# Production CORS settings (very restrictive)
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(',') if os.getenv('CORS_ALLOWED_ORIGINS') else []
CORS_ALLOW_ALL_ORIGINS = False

# Security settings for production (CRITICAL!)
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Email configuration for production
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.getenv('EMAIL_HOST', '')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', '587'))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True') == 'True'
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'noreply@funding-management.com')

# Production logging (important events only)
LOGGING['handlers']['console']['level'] = 'WARNING'
LOGGING['loggers']['django']['level'] = 'WARNING'
LOGGING['loggers']['django.request']['level'] = 'ERROR'
LOGGING['root']['level'] = 'WARNING'

# Database connection pooling for production
DATABASES['default'].update({
    'CONN_MAX_AGE': 600,  # 10 minutes
    'OPTIONS': {
        'connect_timeout': 10,
        'options': '-c statement_timeout=30000',  # 30 seconds
    },
})

# REST Framework settings for production (strict)
REST_FRAMEWORK.update({
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '50/hour',
        'user': '500/hour',
    },
})

# Cache configuration (recommended for production)
# Uncomment and configure if using Redis or Memcached
# CACHES = {
#     'default': {
#         'BACKEND': 'django.core.cache.backends.redis.RedisCache',
#         'LOCATION': os.getenv('REDIS_URL', 'redis://127.0.0.1:6379/1'),
#     }
# }

# Static files handling in production (use WhiteNoise or similar)
# STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

