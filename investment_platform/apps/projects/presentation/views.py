from django.db.models import Q
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema, extend_schema_view
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser

from apps.investments.infrastructure.models import Investment, InvestmentStatus
from apps.investments.presentation.serializers import InvestmentSerializer
from apps.projects.application.dtos import ChangeProjectStatusDTO, CreateProjectDTO
from apps.projects.application.use_cases import change_project_status, create_project, upload_project_document
from apps.projects.domain.state_machine import ProjectStatus
from apps.projects.infrastructure.models import Project
from shared.permissions import IsEntrepreneur, IsOperatorOrAdmin, IsProjectOwnerOrAdmin
from shared.responses import success_response

from .serializers import (
    DocumentSerializer, DocumentUploadSerializer, ProjectCreateSerializer,
    ProjectSerializer, ProjectStatusChangeSerializer,
)

PUBLIC_VISIBLE_STATUSES = [
    ProjectStatus.APPROVED, ProjectStatus.FUNDING, ProjectStatus.FUNDING_COMPLETED,
    ProjectStatus.ACTIVE, ProjectStatus.COMPLETED,
]


@extend_schema_view(
    list=extend_schema(tags=["Projects"], summary="لیست پروژه‌ها", parameters=[
        OpenApiParameter("status", OpenApiTypes.STR), OpenApiParameter("category", OpenApiTypes.STR),
        OpenApiParameter("q", OpenApiTypes.STR), OpenApiParameter("min_profit_rate", OpenApiTypes.NUMBER),
    ]),
    retrieve=extend_schema(tags=["Projects"], summary="جزئیات پروژه"),
    create=extend_schema(tags=["Projects"], summary="ایجاد پروژه (صاحب طرح)"),
    update=extend_schema(tags=["Projects"], summary="ویرایش کامل پروژه"),
    partial_update=extend_schema(tags=["Projects"], summary="ویرایش جزئی پروژه"),
    destroy=extend_schema(tags=["Projects"], summary="حذف پروژه"),
)
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.select_related("owner").all()
    owner_field = "owner_id"

    def get_serializer_class(self):
        if self.action in {"create", "update", "partial_update"}:
            return ProjectCreateSerializer
        return ProjectSerializer

    def get_permissions(self):
        if self.action in {"list", "retrieve"}:
            return [permissions.AllowAny()]
        if self.action == "create":
            return [permissions.IsAuthenticated(), IsEntrepreneur()]
        if self.action in {"update", "partial_update", "destroy", "investors", "upload_document"}:
            return [permissions.IsAuthenticated(), IsProjectOwnerOrAdmin()]
        if self.action == "change_status":
            return [permissions.IsAuthenticated(), IsOperatorOrAdmin()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        qs = Project.objects.select_related("owner").all()
        req = self.request
        if not (req.user.is_authenticated and req.user.is_staff):
            if req.user.is_authenticated and req.user.role in {"ENTREPRENEUR"}:
                qs = qs.filter(Q(status__in=PUBLIC_VISIBLE_STATUSES) | Q(owner=req.user))
            else:
                qs = qs.filter(status__in=PUBLIC_VISIBLE_STATUSES)

        p = req.query_params
        if p.get("status"):
            qs = qs.filter(status=p["status"])
        if p.get("category"):
            qs = qs.filter(category=p["category"])
        if p.get("q"):
            qs = qs.filter(Q(title__icontains=p["q"]) | Q(description__icontains=p["q"]))
        if p.get("min_profit_rate"):
            qs = qs.filter(profit_rate_percentage__gte=p["min_profit_rate"])
        return qs.order_by("-created_at")

    def perform_create(self, serializer):
        dto = CreateProjectDTO(**serializer.validated_data)
        project = create_project.execute(owner=self.request.user, dto=dto)
        serializer.instance = project

    @extend_schema(tags=["Projects"], summary="تغییر وضعیت پروژه (اپراتور/ادمین)", request=ProjectStatusChangeSerializer)
    @action(detail=True, methods=["post"])
    def change_status(self, request, pk=None):
        project = self.get_object()
        serializer = ProjectStatusChangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        dto = ChangeProjectStatusDTO(**serializer.validated_data)
        updated = change_project_status.execute(actor=request.user, project=project, dto=dto)
        return success_response(ProjectSerializer(updated).data)

    @extend_schema(tags=["Projects"], summary="لیست سرمایه‌گذاران پروژه (صاحب طرح/ادمین)")
    @action(detail=True, methods=["get"])
    def investors(self, request, pk=None):
        project = self.get_object()
        self.check_object_permissions(request, project)
        investments = Investment.objects.filter(
            project=project, status=InvestmentStatus.SUCCESSFUL
        ).select_related("investor")
        return success_response(InvestmentSerializer(investments, many=True).data)

    @extend_schema(tags=["Projects"], summary="بارگذاری مدرک برای پروژه (صاحب طرح/ادمین)", request=DocumentUploadSerializer)
    @action(detail=True, methods=["post"], parser_classes=[MultiPartParser, FormParser], url_path="documents")
    def upload_document(self, request, pk=None):
        project = self.get_object()
        self.check_object_permissions(request, project)
        serializer = DocumentUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        doc = upload_project_document.execute(project=project, uploader=request.user, **serializer.validated_data)
        return success_response(DocumentSerializer(doc).data, status_code=201)