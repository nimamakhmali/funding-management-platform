"""
تست‌های CRUD پروژه
"""
import pytest
from decimal import Decimal
from datetime import timedelta
from django.utils import timezone
from rest_framework import status

from apps.projects.domain.state_machine import ProjectStatus
from apps.projects.infrastructure.models import Project


@pytest.mark.django_db
class TestProjectCRUD:
    def test_create_project_as_entrepreneur(self, api_client, entrepreneur_user):
        api_client.force_authenticate(user=entrepreneur_user)
        payload = {
            "title": "پروژه تست",
            "description": "توضیحات پروژه تستی",
            "category": "تکنولوژی",
            "required_budget": "100000.00",
            "min_investment_amount": "1000.00",
            "start_date": timezone.now().isoformat(),
            "end_date": (timezone.now() + timedelta(days=60)).isoformat(),
        }
        response = api_client.post("/api/v1/projects/", payload)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["status"] == ProjectStatus.PENDING_REVIEW

    def test_create_project_as_investor_forbidden(self, api_client, investor_user):
        api_client.force_authenticate(user=investor_user)
        payload = {"title": "Test", "description": "...", "category": "Tech"}
        response = api_client.post("/api/v1/projects/", payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_list_projects_public(self, api_client, approved_project):
        response = api_client.get("/api/v1/projects/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) >= 1

    def test_update_project_by_owner(self, api_client, entrepreneur_user):
        api_client.force_authenticate(user=entrepreneur_user)
        project = Project.objects.create(
            owner=entrepreneur_user,
            title="Original",
            description="...",
            category="Tech",
            required_budget=Decimal("10000"),
            min_investment_amount=Decimal("100"),
            start_date=timezone.now(),
            end_date=timezone.now() + timedelta(days=30),
            status=ProjectStatus.DRAFT,
        )
        payload = {"title": "Updated Title"}
        response = api_client.patch(f"/api/v1/projects/{project.id}/", payload)
        assert response.status_code == status.HTTP_200_OK
        project.refresh_from_db()
        assert project.title == "Updated Title"

    def test_change_status_by_admin(self, admin_client, approved_project):
        payload = {"status": ProjectStatus.FUNDING, "reason": "تأیید شد"}
        response = admin_client.post(
            f"/api/v1/projects/{approved_project.id}/change_status/", payload
        )
        assert response.status_code == status.HTTP_200_OK
        approved_project.refresh_from_db()
        assert approved_project.status == ProjectStatus.FUNDING