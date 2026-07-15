"""
تست‌های OTP
"""
import pytest
from rest_framework import status

from apps.users.infrastructure.models import OTPCode, OTPPurpose


@pytest.mark.django_db
class TestOTP:
    def test_request_otp_success(self, api_client, investor_user):
        payload = {
            "email": investor_user.email,
            "purpose": OTPPurpose.LOGIN,
        }
        response = api_client.post("/api/v1/otp/request/", payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["status"] == "otp_sent"
        assert OTPCode.objects.filter(user=investor_user).exists()

    def test_verify_otp_success(self, api_client, investor_user):
        # ایجاد OTP
        from apps.users.application.use_cases import CreateOTPUseCase
        otp = CreateOTPUseCase().execute(user=investor_user, purpose=OTPPurpose.LOGIN)

        payload = {
            "email": investor_user.email,
            "code": otp.code,
            "purpose": OTPPurpose.LOGIN,
        }
        response = api_client.post("/api/v1/otp/verify/", payload)
        assert response.status_code == status.HTTP_200_OK
        assert "access" in response.data

    def test_verify_otp_invalid_code(self, api_client, investor_user):
        payload = {
            "email": investor_user.email,
            "code": "000000",
            "purpose": OTPPurpose.LOGIN,
        }
        response = api_client.post("/api/v1/otp/verify/", payload)
        assert response.status_code == status.HTTP_400_BAD_REQUEST