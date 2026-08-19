"""
Pytest Configuration & Shared Fixtures
"""
import pytest
from django.conf import settings
from rest_framework.test import APIClient

# تنظیمات محیط تست
settings.OTP_DEBUG_MODE = True
settings.SMS_ENABLED = False
settings.SEJAM_ENABLED = False


@pytest.fixture
def api_client():
    """API Client ساده"""
    return APIClient()


@pytest.fixture
def authenticated_client(api_client, investor_user):
    """Client با احراز هویت"""
    api_client.force_authenticate(user=investor_user)
    return api_client


@pytest.fixture
def admin_client(api_client, admin_user):
    """Client ادمین"""
    api_client.force_authenticate(user=admin_user)
    return api_client


@pytest.fixture(autouse=True)
def enable_db_access_for_all_tests(db):
    """دسترسی به دیتابیس برای همه تست‌ها"""
    pass