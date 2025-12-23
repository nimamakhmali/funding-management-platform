"""
Development environment settings

This file contains settings specific to the development environment.
"""
from .base import *
import os

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '[::1]']

# Development-specific CORS settings (more permissive)
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# Development database (can use SQLite for faster development)
# Uncomment if you want to use SQLite for development
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

# Email backend for development (console output)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Development logging (more verbose)
LOGGING['handlers']['console']['level'] = 'DEBUG'
LOGGING['loggers']['django']['level'] = 'DEBUG'
LOGGING['loggers']['core']['level'] = 'DEBUG'
LOGGING['loggers']['api']['level'] = 'DEBUG'

# Disable security features for development
SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False

# Django Debug Toolbar (optional - uncomment if installed)
# INSTALLED_APPS += ['debug_toolbar']
# MIDDLEWARE.insert(0, 'debug_toolbar.middleware.DebugToolbarMiddleware')
# INTERNAL_IPS = ['127.0.0.1']

# REST Framework settings for development (less strict)
REST_FRAMEWORK.update({
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',  # More permissive for development
    ],
})

