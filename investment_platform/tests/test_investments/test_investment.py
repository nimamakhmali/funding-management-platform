"""
تست‌های سرمایه‌گذاری
"""
import pytest
from decimal import Decimal
from rest_framework import status

from apps.investments.infrastructure.models import Investment, InvestmentStatus
from apps.projects.domain.state_machine import ProjectStatus


@pytest.mark.django_db
class TestInvestment:
    def test_process_investment_success(
        self, api_client, investor_user, approved_project, wallet_with_balance
    ):
        api_client.force_authenticate(user=investor_user)
        payload = {
            "project_id": str(approved_project.id),
            "amount": "5000.00",
        }
        response = api_client.post("/api/v1/invest/", payload)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["status"] == InvestmentStatus.PENDING

        wallet_with_balance.refresh_from_db()
        assert wallet_with_balance.blocked_amount == Decimal("5000.00")

    def test_investment_insufficient_balance(
        self, api_client, investor_user, approved_project, wallet_with_balance
    ):
        api_client.force_authenticate(user=investor_user)
        payload = {
            "project_id": str(approved_project.id),
            "amount": "100000.00",  # بیشتر از موجودی
        }
        response = api_client.post("/api/v1/invest/", payload)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "کافی نیست" in str(response.data)

    def test_confirm_investment_payment_success(
        self, admin_client, investor_user, approved_project, wallet_with_balance
    ):
        # ایجاد سرمایه‌گذاری
        from apps.investments.application.use_cases import ProcessInvestmentUseCase
        investment = ProcessInvestmentUseCase().execute(
            investor=investor_user,
            project=approved_project,
            amount=Decimal("3000.00"),
        )

        payload = {"is_successful": True, "reference_id": "REF123"}
        response = admin_client.post(
            f"/api/v1/investments/{investment.id}/confirm/", payload
        )
        assert response.status_code == status.HTTP_200_OK

        investment.refresh_from_db()
        assert investment.status == InvestmentStatus.CONFIRMED

        wallet_with_balance.refresh_from_db()
        assert wallet_with_balance.blocked_amount == Decimal("0.00")
        assert wallet_with_balance.balance == Decimal("47000.00")  # 50000 - 3000