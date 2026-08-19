from django.db.models import Q, Prefetch, Sum, Count
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema, extend_schema_view
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.views import APIView

from rest_framework.response import Response
from django.db.models import Sum, Count, Q
from decimal import Decimal


from apps.investments.infrastructure.models import Investment, InvestmentStatus
from apps.investments.presentation.serializers import InvestmentSerializer
from apps.projects.application.dtos import ChangeProjectStatusDTO, CreateProjectDTO
from apps.projects.application.use_cases import (
    change_project_status, create_project, upload_project_document,
)
from apps.projects.domain.state_machine import ProjectStatus
from apps.projects.infrastructure.models import Document, Project
from shared.permissions import IsEntrepreneur, IsOperatorOrAdmin, IsProjectOwnerOrAdmin
from shared.responses import success_response

from .serializers import (
    DocumentSerializer, DocumentUploadSerializer,
    ProjectCreateSerializer, ProjectListSerializer,
    ProjectSerializer, ProjectStatusChangeSerializer,
)

PUBLIC_VISIBLE_STATUSES = [
    ProjectStatus.APPROVED,
    ProjectStatus.FUNDING,
    ProjectStatus.FUNDING_COMPLETED,
    ProjectStatus.ACTIVE,
    ProjectStatus.COMPLETED,
]

ACTIVE_STATUSES = [
    ProjectStatus.FUNDING,
    ProjectStatus.ACTIVE,
    ProjectStatus.APPROVED,
]


@extend_schema_view(
    list=extend_schema(
        tags=["Projects"], summary="لیست پروژه‌ها",
        parameters=[
            OpenApiParameter("status", OpenApiTypes.STR),
            OpenApiParameter("category", OpenApiTypes.STR),
            OpenApiParameter("q", OpenApiTypes.STR),
            OpenApiParameter("min_profit_rate", OpenApiTypes.NUMBER),
            OpenApiParameter("my_projects", OpenApiTypes.BOOL,
                             description="فقط پروژه‌های خودم"),
        ],
    ),
    retrieve=extend_schema(tags=["Projects"], summary="جزئیات پروژه"),
    create=extend_schema(tags=["Projects"], summary="ایجاد پروژه (صاحب طرح)"),
    update=extend_schema(tags=["Projects"], summary="ویرایش کامل پروژه"),
    partial_update=extend_schema(tags=["Projects"], summary="ویرایش جزئی پروژه"),
    destroy=extend_schema(tags=["Projects"], summary="حذف پروژه"),
)
class ProjectViewSet(viewsets.ModelViewSet):
    owner_field = "owner_id"
    
    def get_serializer_class(self):
        if self.action in {"create", "update", "partial_update"}:
            return ProjectCreateSerializer
        if self.action == "list":
            return ProjectListSerializer
        return ProjectSerializer

    def get_permissions(self):
        if self.action in {"list", "retrieve"}:
            return [permissions.AllowAny()]
        if self.action == "create":
            return [permissions.IsAuthenticated(), IsEntrepreneur()]
        if self.action in {"update", "partial_update", "destroy",
                           "investors", "upload_document"}:
            return [permissions.IsAuthenticated(), IsProjectOwnerOrAdmin()]
        if self.action == "change_status":
            return [permissions.IsAuthenticated(), IsOperatorOrAdmin()]
        if self.action == "owner_dashboard":
            return [permissions.IsAuthenticated(), IsEntrepreneur()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        qs = Project.objects.select_related("owner").prefetch_related(
            Prefetch(
                "investments",
                queryset=Investment.objects.filter(
                    status=InvestmentStatus.SUCCESSFUL
                ).only("id", "project_id", "amount"),
            )
        )

        req = self.request

        # فیلتر my_projects برای صاحب طرح
        if req.query_params.get("my_projects") == "true":
            if req.user.is_authenticated:
                qs = qs.filter(owner=req.user)
            return qs.order_by("-created_at")

        # فیلتر دسترسی عمومی
        if not (req.user.is_authenticated and req.user.is_staff):
            if req.user.is_authenticated and req.user.role in {
                "ENTREPRENEUR", "PROJECT_OWNER"
            }:
                qs = qs.filter(
                    Q(status__in=PUBLIC_VISIBLE_STATUSES) | Q(owner=req.user)
                )
            else:
                qs = qs.filter(status__in=PUBLIC_VISIBLE_STATUSES)

        if self.action == "retrieve":
            qs = qs.prefetch_related(
                Prefetch(
                    "documents",
                    queryset=Document.objects.select_related("uploader")
                    .order_by("created_at"),
                )
            )

        p = req.query_params
        if p.get("status"):
            qs = qs.filter(status=p["status"])
        if p.get("category"):
            qs = qs.filter(category=p["category"])
        if p.get("q"):
            qs = qs.filter(
                Q(title__icontains=p["q"]) | Q(description__icontains=p["q"])
            )
        if p.get("min_profit_rate"):
            qs = qs.filter(profit_rate_percentage__gte=p["min_profit_rate"])

        return qs.order_by("-created_at")

    def perform_create(self, serializer):
        dto = CreateProjectDTO(**{
            k: v for k, v in serializer.validated_data.items()
            if k != "cover_image"
        })
        project = create_project.execute(owner=self.request.user, dto=dto)
        if "cover_image" in serializer.validated_data:
            project.cover_image = serializer.validated_data["cover_image"]
            project.save(update_fields=["cover_image"])
        serializer.instance = project

    @extend_schema(
        tags=["Projects"],
        summary="داشبورد صاحب طرح - آمار و خلاصه پروژه‌ها",
        responses={200: None},
    )
    @action(
        detail=False,
        methods=["get"],
        url_path="owner-dashboard",
        permission_classes=[permissions.IsAuthenticated, IsEntrepreneur],
    )
    def owner_dashboard(self, request):
        """
        یک endpoint واحد که تمام داده‌های مورد نیاز
        داشبورد صاحب طرح را برمی‌گرداند.
        """
        user = request.user
        my_projects = Project.objects.filter(owner=user).prefetch_related(
            Prefetch(
                "investments",
                queryset=Investment.objects.filter(
                    status=InvestmentStatus.SUCCESSFUL
                ).only("id", "project_id", "amount"),
            )
        )

        # ── آمار کلی ────────────────────────────────────────────────────────
        total_projects = my_projects.count()
        active_projects = my_projects.filter(
            status__in=ACTIVE_STATUSES
        ).count()

        # کل سرمایه جذب‌شده از تمام پروژه‌ها
        total_raised = my_projects.aggregate(
            total=Sum("raised_amount")
        )["total"] or 0

        # سود پیش‌بینی‌شده: مجموع (raised_amount * profit_rate / 100) برای پروژه‌های فعال
        active_qs = my_projects.filter(status__in=ACTIVE_STATUSES)
        expected_profit = sum(
            (p.raised_amount * (p.profit_rate_percentage or 0) / 100)
            for p in active_qs
        )

        # سود تحقق‌یافته از PayoutItem های پرداخت‌شده
        try:
            from apps.profits.infrastructure.models import PayoutItem
            realized_profit = PayoutItem.objects.filter(
                profit_period__project__owner=user,
                status="PAID_TO_WALLET",
            ).aggregate(total=Sum("amount"))["total"] or 0
        except Exception:
            realized_profit = 0

        # ROI میانگین
        projects_with_profit = my_projects.filter(
            profit_rate_percentage__isnull=False,
            raised_amount__gt=0,
        )
        roi = 0
        if projects_with_profit.exists():
            total_roi = sum(
                float(p.profit_rate_percentage or 0)
                for p in projects_with_profit
            )
            roi = total_roi / projects_with_profit.count()

        # ── فعال‌ترین پروژه ──────────────────────────────────────────────────
        most_active = (
            my_projects.filter(status__in=ACTIVE_STATUSES)
            .order_by("-raised_amount")
            .first()
        )

        active_project_data = None
        if most_active:
            active_project_data = {
                "id": str(most_active.id),
                "title": most_active.title,
                "status": most_active.status,
                "status_display": most_active.get_status_display(),
                "progress": float(most_active.funding_percentage),
                "required_budget": str(most_active.required_budget),
                "raised_amount": str(most_active.raised_amount),
                "investors_count": most_active.investors_count,
                "remaining_days": most_active.remaining_days,
                "cover_image_url": most_active.cover_image_url,
            }

        # ── ساختار پاسخ ─────────────────────────────────────────────────────
        data = {
            # کارت‌های آماری
            "stats": {
                "total_raised": str(total_raised),
                "expected_profit": str(expected_profit),
                "realized_profit": str(realized_profit),
                "roi_percentage": round(roi, 2),
                "total_projects": total_projects,
                "active_projects": active_projects,
            },
            # فعال‌ترین پروژه
            "most_active_project": active_project_data,
        }

        return success_response(data)

    @extend_schema(
        tags=["Projects"],
        summary="تغییر وضعیت پروژه (اپراتور/ادمین)",
        request=ProjectStatusChangeSerializer,
    )
    @action(detail=True, methods=["post"])
    def change_status(self, request, pk=None):
        project = self.get_object()
        serializer = ProjectStatusChangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        dto = ChangeProjectStatusDTO(**serializer.validated_data)
        updated = change_project_status.execute(
            actor=request.user, project=project, dto=dto
        )
        return success_response(
            ProjectSerializer(updated, context={"request": request}).data
        )

    @extend_schema(
        tags=["Projects"],
        summary="لیست سرمایه‌گذاران پروژه (صاحب طرح/ادمین)",
    )
    @action(detail=True, methods=["get"])
    def investors(self, request, pk=None):
        project = self.get_object()
        self.check_object_permissions(request, project)
        investments = (
            Investment.objects
            .filter(project=project, status=InvestmentStatus.SUCCESSFUL)
            .select_related("investor")
        )
        return success_response(
            InvestmentSerializer(investments, many=True).data
        )

    @extend_schema(
        tags=["Projects"],
        summary="بارگذاری مدرک برای پروژه (صاحب طرح/ادمین)",
        request=DocumentUploadSerializer,
    )
    @action(
        detail=True, methods=["post"],
        parser_classes=[MultiPartParser, FormParser],
        url_path="documents",
    )
    def upload_document(self, request, pk=None):
        project = self.get_object()
        self.check_object_permissions(request, project)
        serializer = DocumentUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        doc = upload_project_document.execute(
            project=project,
            uploader=request.user,
            **serializer.validated_data,
        )
        return success_response(
            DocumentSerializer(doc, context={"request": request}).data,
            status_code=201,
        )
        
    @extend_schema(tags=["Projects"], summary="آمار کلی پلتفرم (عمومی)", responses={200: None})
    @action(
        detail=False,
        methods=["get"],
        url_path="platform-stats",
        permission_classes=[permissions.AllowAny],
    )
    def platform_stats(self, request):
        """
        آمار کلی پلتفرم برای صفحه اصلی (landing page).
        بدون نیاز به احراز هویت.
        """
        from apps.investments.infrastructure.models import Investment, InvestmentStatus
        from apps.users.infrastructure.models import User

        # تعداد سرمایه‌گذاران فعال (کاربران با نقش INVESTOR که سرمایه‌گذاری موفق دارند)
        total_investors = (
            Investment.objects
            .filter(status=InvestmentStatus.SUCCESSFUL)
            .values("investor")
            .distinct()
            .count()
        )

        # پروژه‌های موفق (تکمیل‌شده)
        successful_projects = Project.objects.filter(
            status=ProjectStatus.COMPLETED
        ).count()

        # حجم کل تأمین مالی (مجموع raised_amount تمام پروژه‌ها)
        total_funded = Project.objects.aggregate(
            total=Sum("raised_amount")
        )["total"] or 0

        # میانگین نرخ سود پروژه‌های فعال
        avg_profit_rate = (
            Project.objects
            .filter(
                status__in=PUBLIC_VISIBLE_STATUSES,
                profit_rate_percentage__isnull=False,
            )
            .aggregate(avg=Sum("profit_rate_percentage") / Count("id"))
            ["avg"] or 0
        )

        # تعداد پروژه‌های در حال تأمین مالی
        active_funding = Project.objects.filter(
            status=ProjectStatus.FUNDING
        ).count()

        data = {
            "total_investors": total_investors,
            "successful_projects": successful_projects,
            "total_funded_amount": str(total_funded),
            "avg_profit_rate": round(float(avg_profit_rate), 1),
            "active_funding_projects": active_funding,
        }

        return success_response(data)    
    
    
    @extend_schema(
    tags=["Projects"],
    summary="گزارش جامع پروژه‌های صاحب طرح",
    parameters=[
        OpenApiParameter("date_from", OpenApiTypes.DATE, description="از تاریخ"),
        OpenApiParameter("date_to", OpenApiTypes.DATE, description="تا تاریخ"),
        OpenApiParameter("project_id", OpenApiTypes.UUID, description="فیلتر پروژه خاص"),
        OpenApiParameter("report_type", OpenApiTypes.STR, description="نوع گزارش"),
    ],
    responses={200: None},
    )
    @action(
        detail=False,
        methods=["get"],
        url_path="owner-reports",
        permission_classes=[permissions.IsAuthenticated, IsEntrepreneur],
    )
    def owner_reports(self, request):
        """
        گزارش جامع برای پنل صاحب طرح:
        - آمار کارت‌ها
        - جدول پروژه‌ها
        - داده نمودار وضعیت پروژه‌ها
        - داده نمودار مقایسه‌ای
        """
        user = request.user
        p = request.query_params

        # فیلتر پایه
        qs = Project.objects.filter(owner=user).prefetch_related(
            Prefetch(
                "investments",
                queryset=Investment.objects.filter(
                    status=InvestmentStatus.SUCCESSFUL
                ).only("id", "project_id", "amount"),
            )
        )

        # فیلتر تاریخ
        date_from = p.get("date_from")
        date_to = p.get("date_to")
        if date_from:
            try:
                qs = qs.filter(start_date__gte=date_from)
            except Exception:
                pass
        if date_to:
            try:
                qs = qs.filter(end_date__lte=date_to)
            except Exception:
                pass

        # فیلتر پروژه خاص
        project_id = p.get("project_id")
        if project_id:
            qs = qs.filter(id=project_id)

        projects = list(qs.order_by("-created_at"))

        # ── آمار کارت‌ها ────────────────────────────────────────────────────────
        total_projects = len(projects)
        active_count = sum(1 for proj in projects if proj.status in ACTIVE_STATUSES)
        total_raised = sum(proj.raised_amount for proj in projects)
        total_required = sum(proj.required_budget for proj in projects)

        avg_progress = (
            sum(float(proj.funding_percentage) for proj in projects) / total_projects
            if total_projects > 0 else 0
        )

        # سود پرداخت‌شده
        try:
            from apps.profits.infrastructure.models import PayoutItem
            total_profit_paid = PayoutItem.objects.filter(
                period__project__owner=user,
                status="PAID_TO_WALLET",
            ).aggregate(total=Sum("amount"))["total"] or 0
        except Exception:
            total_profit_paid = 0

        # ── داده جدول ────────────────────────────────────────────────────────────
        table_data = []
        for proj in projects:
            table_data.append({
                "id": str(proj.id),
                "project_name": proj.title,
                "start_date": proj.start_date.strftime("%Y/%m/%d") if proj.start_date else "—",
                "target_amount": str(proj.required_budget),
                "raised_amount": str(proj.raised_amount),
                "progress": round(float(proj.funding_percentage), 1),
                "status": proj.get_status_display(),
                "status_code": proj.status,
                "investors_count": proj.investors_count,
                "profit_rate": str(proj.profit_rate_percentage or 0),
            })

        # ── داده نمودار وضعیت ─────────────────────────────────────────────────────
        from collections import Counter
        status_counts = Counter(proj.status for proj in projects)
        status_chart = [
            {
                "status": k,
                "status_display": Project(status=k).get_status_display(),
                "count": v,
            }
            for k, v in status_counts.items()
        ]

        # ── داده نمودار مقایسه‌ای (raised vs target) ─────────────────────────────
        comparison_chart = [
            {
                "name": proj.title[:20],
                "target": float(proj.required_budget),
                "raised": float(proj.raised_amount),
                "progress": round(float(proj.funding_percentage), 1),
            }
            for proj in projects[:6]  # حداکثر ۶ پروژه
        ]

        data = {
            "stats": {
                "total_projects": total_projects,
                "active_projects": active_count,
                "total_raised": str(total_raised),
                "total_required": str(total_required),
                "avg_progress": round(avg_progress, 1),
                "total_profit_paid": str(total_profit_paid),
            },
            "table": table_data,
            "status_chart": status_chart,
            "comparison_chart": comparison_chart,
        }


    @extend_schema(
        tags=["Projects"],
        summary="آمار ماهانه جذب سرمایه صاحب طرح",
        responses={200: None},
    )
    @action(
        detail=False,
        methods=["get"],
        url_path="owner-monthly-stats",
    )
    def owner_monthly_stats(self, request):
        from django.db.models.functions import TruncMonth
        from django.utils import timezone
        import datetime

        PERSIAN_MONTHS = {
            1: "فروردین", 2: "اردیبهشت", 3: "خرداد",
            4: "تیر",     5: "مرداد",    6: "شهریور",
            7: "مهر",     8: "آبان",     9: "آذر",
            10: "دی",     11: "بهمن",    12: "اسفند",
        }

        def to_jalali_month(dt):
            try:
                import jdatetime
                jd = jdatetime.datetime.fromgregorian(datetime=dt)
                return PERSIAN_MONTHS.get(jd.month, str(jd.month))
            except ImportError:
                return PERSIAN_MONTHS.get(dt.month, str(dt.month))

        six_months_ago = timezone.now() - datetime.timedelta(days=180)

        monthly = (
            Investment.objects
            .filter(
                project__owner=request.user,
                status=InvestmentStatus.SUCCESSFUL,
                created_at__gte=six_months_ago,
            )
            .annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(total=Sum("amount"))
            .order_by("month")
        )

        data = [
            {
                "month": to_jalali_month(item["month"]),
                "value": float(item["total"] or 0),
            }
            for item in monthly
        ]

        if not data:
            now = timezone.now()
            data = [
                {
                    "month": PERSIAN_MONTHS.get((now.month - i - 1) % 12 + 1, ""),
                    "value": 0,
                }
                for i in range(5, -1, -1)
            ]

        return success_response(data)
