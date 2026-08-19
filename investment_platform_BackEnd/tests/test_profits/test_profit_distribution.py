"""
تست‌های توزیع سود
"""
import pytest
from decimal import Decimal
from rest_framework import status

from apps.investments.infrastructure.models import InvestmentStatus
from apps.profits.infrastructure.models import (
    PayoutItemStatus,
    ProfitPeriod,
    ProfitPeriodStatus,
)


@pytest.mark.django_db
class TestProfitDistribution:
    @pytest.fixture
    def profit_period(self, approved_project):
        return ProfitPeriod.objects.create(
            project=approved_project,
            title="دوره سود Q1",
            calculation_date=timezone.now(),
            total_profit_amount=Decimal("10000.00"),
            status=ProfitPeriodStatus.CALCULATING,
        )

    @pytest.fixture
    def confirmed_investments(self, approved_project, db):
        from tests.factories import UserFactory, WalletFactory

        investors = [UserFactory() for _ in range(3)]
        for inv in investors:
            WalletFactory(user=inv)

        from apps.investments.infrastructure.models import Investment

        investments = [
            Investment.objects.create(
                investor=investors[0],
                project=approved_project,
                amount=Decimal("5000.00"),
                status=InvestmentStatus.CONFIRMED,
            ),
            Investment.objects.create(
                investor=investors[1],
                project=approved_project,
                amount=Decimal("3000.00"),
                status=InvestmentStatus.CONFIRMED,
            ),
            Investment.objects.create(
                investor=investors[2],
                project=approved_project,
                amount=Decimal("2000.00"),
                status=InvestmentStatus.CONFIRMED,
            ),
        ]
        return investments

    def test_calculate_profit_distribution(
        self, admin_client, profit_period, confirmed_investments
    ):
        response = admin_client.post(
            f"/api/v1/profit-periods/{profit_period.id}/calculate/"
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data["items_count"] == 3

        profit_period.refresh_from_db()
        assert profit_period.status == ProfitPeriodStatus.APPROVED

        # بررسی جمع سود = total
        items = profit_period.payout_items.all()
        total = sum(item.amount for item in items)
        assert total == profit_period.total_profit_amount

    def test_approve_payout(self, admin_client, profit_period, confirmed_investments):
        # محاسبه
        from apps.profits.application.use_cases import (
            CalculateProfitDistributionUseCase,
        )

        CalculateProfitDistributionUseCase().execute(
            profit_period_id=profit_period.id, actor=admin_client.handler._force_user
        )

        item = profit_period.payout_items.first()
        response = admin_client.post(f"/api/v1/payouts/{item.id}/approve/")
        assert response.status_code == status.HTTP_200_OK

        item.refresh_from_db()
        assert item.status == PayoutItemStatus.PAID_TO_WALLET
        assert item.transaction is not None