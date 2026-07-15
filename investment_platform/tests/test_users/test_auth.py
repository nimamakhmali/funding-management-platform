"""
تست‌های احراز هویت
"""
import pytest
from rest_framework import status

from apps.users.infrastructure.models import User, UserRole


@pytest.mark.django_db
class TestUserRegistration:
    def test_register_success(self, api_client):
        payload = {
            "username": "newuser",
            "email": "newuser@example.com",
            "phone_number": "09123456789",
            "role": UserRole.INVESTOR,
            "password": "strongpass123",
            "password_confirm": "strongpass123",
        }
        response = api_client.post("/api/v1/register/", payload)
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(email="newuser@example.com").exists()

    def test_register_password_mismatch(self, api_client):
        payload = {
            "username": "user",
            "email": "user@example.com",
            "role": UserRole.INVESTOR,
            "password": "pass1",
            "password_confirm": "pass2",
        }
        response = api_client.post("/api/v1/register/", payload)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "password" in response.data


@pytest.mark.django_db
class TestLogin:
    def test_login_success(self, api_client, investor_user):
        payload = {"email": investor_user.email, "password": "testpass123"}
        response = api_client.post("/api/v1/login/", payload)
        assert response.status_code == status.HTTP_200_OK
        assert "access" in response.data
        assert "refresh" in response.data

    def test_login_invalid_credentials(self, api_client, investor_user):
        payload = {"email": investor_user.email, "password": "wrongpass"}
        response = api_client.post("/api/v1/login/", payload)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED