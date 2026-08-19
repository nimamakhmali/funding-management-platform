"""
تست‌های احراز هویت
"""
import pytest
from rest_framework import status

from apps.users.infrastructure.models import OTPCode, OTPPurpose, User, UserRole


@pytest.mark.django_db
class TestUserRegistration:
    def test_register_success(self, api_client):
        payload = {
            "phone_number": "+981234567890",
            "role": UserRole.INVESTOR,
        }
        response = api_client.post("/api/v1/register/", payload)
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(phone_number="+981234567890").exists()

    def test_register_duplicate_phone(self, api_client, investor_user):
        payload = {
            "phone_number": investor_user.phone_number,
            "role": UserRole.INVESTOR,
        }
        response = api_client.post("/api/v1/register/", payload)
        assert response.status_code == status.HTTP_409_CONFLICT


@pytest.mark.django_db
class TestLogin:
    def test_login_success(self, api_client, investor_user):
        payload = {"phone_number": investor_user.phone_number, "password": "testpass123"}
        response = api_client.post("/api/v1/login/", payload)
        assert response.status_code == status.HTTP_200_OK
        assert "access" in response.data
        assert "refresh" in response.data

    def test_login_invalid_credentials(self, api_client, investor_user):
        payload = {"phone_number": investor_user.phone_number, "password": "wrongpass"}
        response = api_client.post("/api/v1/login/", payload)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestForgotPassword:
    def test_forgot_password_sends_otp(self, api_client, investor_user):
        payload = {"phone_number": investor_user.phone_number}
        response = api_client.post("/api/v1/password/forgot/", payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["status"] == "otp_sent"
        assert OTPCode.objects.filter(user=investor_user, purpose=OTPPurpose.RESET_PASSWORD).exists()

    def test_forgot_password_unknown_phone(self, api_client):
        payload = {"phone_number": "+981234567899"}
        response = api_client.post("/api/v1/password/forgot/", payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["status"] == "otp_sent"


@pytest.mark.django_db
class TestResetPassword:
    def test_reset_password_success(self, api_client, investor_user):
        from apps.users.application.use_cases import CreateOTPUseCase
        otp = CreateOTPUseCase().execute(user=investor_user, purpose=OTPPurpose.RESET_PASSWORD)

        payload = {
            "phone_number": investor_user.phone_number,
            "code": otp.code,
            "new_password": "newstrongpass123",
            "new_password_confirm": "newstrongpass123",
        }
        response = api_client.post("/api/v1/password/reset/", payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == str(investor_user.id)

        investor_user.refresh_from_db()
        assert investor_user.check_password("newstrongpass123")

    def test_reset_password_invalid_code(self, api_client, investor_user):
        payload = {
            "phone_number": investor_user.phone_number,
            "code": "000000",
            "new_password": "newstrongpass123",
            "new_password_confirm": "newstrongpass123",
        }
        response = api_client.post("/api/v1/password/reset/", payload)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_reset_password_mismatch(self, api_client):
        payload = {
            "phone_number": "+981234567890",
            "code": "123456",
            "new_password": "newstrongpass123",
            "new_password_confirm": "differentpass",
        }
        response = api_client.post("/api/v1/password/reset/", payload)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "new_password" in response.data