"""
Factory Boy Factories برای ساخت داده‌های تست
"""
from decimal import Decimal
from datetime import timedelta

import factory
from django.utils import timezone
from factory.django import DjangoModelFactory

from apps.investments.infrastructure.models import Investment, Wallet
from apps.projects.domain.state_machine import ProjectStatus
from apps.projects.infrastructure.models import Project
from apps.users.infrastructure.models import User, UserProfile, UserRole


class UserFactory(DjangoModelFactory):
    class Meta:
        model = User

    id = factory.Faker("uuid4")
    username = factory.Sequence(lambda n: f"user{n}")
    email = factory.LazyAttribute(lambda obj: f"{obj.username}@example.com")
    phone_number = factory.Sequence(lambda n: f"+98123456{n:03d}")
    role = UserRole.INVESTOR
    is_active = True

    @factory.post_generation
    def password(obj, create, extracted, **kwargs):
        if create:
            obj.set_password(extracted or "testpass123")
            obj.save()


class AdminUserFactory(UserFactory):
    role = UserRole.ADMIN
    is_staff = True
    is_superuser = True


class EntrepreneurUserFactory(UserFactory):
    role = UserRole.ENTREPRENEUR


class UserProfileFactory(DjangoModelFactory):
    class Meta:
        model = UserProfile

    user = factory.SubFactory(UserFactory)
    company_name = factory.Faker("company")
    bio = factory.Faker("text", max_nb_chars=200)


class WalletFactory(DjangoModelFactory):
    class Meta:
        model = Wallet

    user = factory.SubFactory(UserFactory)
    balance = Decimal("10000.00")
    blocked_amount = Decimal("0.00")


class ProjectFactory(DjangoModelFactory):
    class Meta:
        model = Project

    owner = factory.SubFactory(EntrepreneurUserFactory)
    title = factory.Faker("sentence", nb_words=5)
    description = factory.Faker("text")
    category = "تکنولوژی"
    required_budget = Decimal("100000.00")
    raised_amount = Decimal("0.00")
    min_investment_amount = Decimal("1000.00")
    start_date = factory.LazyFunction(timezone.now)
    end_date = factory.LazyFunction(lambda: timezone.now() + timedelta(days=90))
    status = ProjectStatus.PENDING_REVIEW


class ApprovedProjectFactory(ProjectFactory):
    status = ProjectStatus.APPROVED


class InvestmentFactory(DjangoModelFactory):
    class Meta:
        model = Investment

    investor = factory.SubFactory(UserFactory)
    project = factory.SubFactory(ApprovedProjectFactory)
    amount = Decimal("5000.00")
    status = "PENDING"


# Quick access fixtures for pytest
@pytest.fixture
def investor_user(db):
    return UserFactory(role=UserRole.INVESTOR)


@pytest.fixture
def entrepreneur_user(db):
    return EntrepreneurUserFactory()


@pytest.fixture
def admin_user(db):
    return AdminUserFactory()


@pytest.fixture
def approved_project(db, entrepreneur_user):
    return ApprovedProjectFactory(owner=entrepreneur_user)


@pytest.fixture
def wallet_with_balance(db, investor_user):
    return WalletFactory(user=investor_user, balance=Decimal("50000.00"))