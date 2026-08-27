"""
Admin-specific views — داشبورد، تراکنش‌ها و گزارش‌های مدیریتی
"""
from __future__ import annotations

from django.db.models import Count, Sum, Q
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import permissions
from rest_framework.views import APIView

from apps.investments.infrastructure.models import (
    Transaction, TransactionType, Wallet,
    Investment, InvestmentStatus,
)
from apps.projects.infrastructure.models import Project
from apps.projects.domain.state_machine import ProjectStatus
from apps.users.infrastructure.models import User
from shared.pagination import StandardResultsSetPagination as StandardPagination
from shared.permissions import IsObserverOrAbove, IsOperatorOrAdmin
from shared.responses import error_response, success_response


class AdminDashboardStatsView(APIView):
    """
    آمار کلی داشبورد ادمین:
    - کل کاربران
    - کل سرمایه‌گذاری
    - پروژه‌های فعال
    - تراکنش‌های امروز
    """
    permission_classes = [permissions.IsAuthenticated, IsObserverOrAbove]

    def get(self, request):
        from django.utils import timezone
        import datetime

        today = timezone.now().date()

        total_users = User.objects.filter(is_active=True).count()

        total_invested = (
            Investment.objects
            .filter(status=InvestmentStatus.SUCCESSFUL)
            .aggregate(total=Sum("amount"))["total"] or 0
        )

        active_projects = Project.objects.filter(
            status__in=[ProjectStatus.FUNDING, ProjectStatus.ACTIVE, ProjectStatus.APPROVED]
        ).count()

        today_transactions = Transaction.objects.filter(
            created_at__date=today,
            is_successful=True,
        ).count()

        today_volume = (
            Transaction.objects
            .filter(created_at__date=today, is_successful=True)
            .aggregate(total=Sum("amount"))["total"] or 0
        )

        pending_projects = Project.objects.filter(
            status=ProjectStatus.PENDING_REVIEW
        ).count()

        data = {
            "total_users": total_users,
            "total_invested": str(total_invested),
            "active_projects": active_projects,
            "today_transactions": today_transactions,
            "today_volume": str(today_volume),
            "pending_projects": pending_projects,
        }
        return success_response(data)


class AdminTransactionListView(APIView):
    """
    لیست تمام تراکنش‌ها برای پنل ادمین
    فیلترها: type, is_successful, date_from, date_to, user_id
    """
    permission_classes = [permissions.IsAuthenticated, IsObserverOrAbove]

    def get(self, request):
        qs = (
            Transaction.objects
            .select_related("user")
            .order_by("-created_at")
        )

        p = request.query_params

        if p.get("type"):
            qs = qs.filter(type=p["type"])

        if p.get("is_successful") in {"true", "false"}:
            qs = qs.filter(is_successful=(p["is_successful"] == "true"))

        if p.get("date_from"):
            try:
                qs = qs.filter(created_at__date__gte=p["date_from"])
            except Exception:
                pass

        if p.get("date_to"):
            try:
                qs = qs.filter(created_at__date__lte=p["date_to"])
            except Exception:
                pass

        if p.get("user_id"):
            qs = qs.filter(user_id=p["user_id"])

        if p.get("min_amount"):
            try:
                qs = qs.filter(amount__gte=float(p["min_amount"]))
            except Exception:
                pass

        if p.get("max_amount"):
            try:
                qs = qs.filter(amount__lte=float(p["max_amount"]))
            except Exception:
                pass

        paginator = StandardPagination()
        page = paginator.paginate_queryset(qs, request)

        results = []
        for tx in (page if page is not None else qs):
            profile = getattr(tx.user, "profile", None)
            full_name = ""
            if profile:
                fn = getattr(profile, "first_name", "") or ""
                ln = getattr(profile, "last_name", "") or ""
                full_name = f"{fn} {ln}".strip()
            if not full_name:
                full_name = tx.user.phone_number

            results.append({
                "id": str(tx.id),
                "user": {
                    "id": str(tx.user.id),
                    "name": full_name,
                    "phone_number": tx.user.phone_number,
                    "initials": full_name[:2] if full_name else "؟؟",
                },
                "type": tx.type,
                "type_display": tx.get_type_display() if hasattr(tx, "get_type_display") else tx.type,
                "amount": str(tx.amount),
                "is_successful": tx.is_successful,
                "reference_id": tx.reference_id or "",
                "created_at": tx.created_at.isoformat(),
            })

        if page is not None:
            return paginator.get_paginated_response(results)
        return success_response(results)


class AdminRecentTransactionsView(APIView):
    """
    آخرین تراکنش‌ها برای جدول داشبورد ادمین (بدون pagination، حداکثر 10 رکورد)
    """
    permission_classes = [permissions.IsAuthenticated, IsObserverOrAbove]

    def get(self, request):
        transactions = (
            Transaction.objects
            .select_related("user")
            .filter(is_successful=True)
            .order_by("-created_at")[:10]
        )

        results = []
        for tx in transactions:
            profile = getattr(tx.user, "profile", None)
            full_name = ""
            if profile:
                fn = getattr(profile, "first_name", "") or ""
                ln = getattr(profile, "last_name", "") or ""
                full_name = f"{fn} {ln}".strip()
            if not full_name:
                full_name = tx.user.phone_number

            results.append({
                "id": str(tx.id),
                "reference_id": tx.reference_id or f"TRX-{str(tx.id)[:6].upper()}",
                "user": {
                    "name": full_name,
                    "phone_number": tx.user.phone_number,
                },
                "type": tx.type,
                "type_display": tx.get_type_display() if hasattr(tx, "get_type_display") else tx.type,
                "amount": str(tx.amount),
                "is_successful": tx.is_successful,
                "created_at": tx.created_at.isoformat(),
            })

        return success_response(results)


class AdminMonthlyChartView(APIView):
    """
    داده نمودار ماهانه برای داشبورد ادمین
    """
    permission_classes = [permissions.IsAuthenticated, IsObserverOrAbove]

    def get(self, request):
        from django.db.models.functions import TruncMonth
        from django.utils import timezone
        import datetime

        PERSIAN_MONTHS = {
            1: "فروردین", 2: "اردیبهشت", 3: "خرداد",
            4: "تیر", 5: "مرداد", 6: "شهریور",
            7: "مهر", 8: "آبان", 9: "آذر",
            10: "دی", 11: "بهمن", 12: "اسفند",
        }

        def to_jalali_month(dt):
            try:
                import jdatetime
                jd = jdatetime.datetime.fromgregorian(datetime=dt)
                return PERSIAN_MONTHS.get(jd.month, str(jd.month))
            except ImportError:
                return PERSIAN_MONTHS.get(dt.month, str(dt.month))

        six_months_ago = timezone.now() - datetime.timedelta(days=180)

        # ── Investment فیلد created_at ندارد — از invest_date استفاده می‌کنیم ──
        monthly = (
            Investment.objects
            .filter(
                status=InvestmentStatus.SUCCESSFUL,
                invest_date__gte=six_months_ago,   # ← تغییر: created_at → invest_date
            )
            .annotate(month=TruncMonth("invest_date"))  # ← تغییر: created_at → invest_date
            .values("month")
            .annotate(total=Sum("amount"), count=Count("id"))
            .order_by("month")
        )

        data = [
            {
                "month": to_jalali_month(item["month"]),
                "value": float(item["total"] or 0),
                "count": item["count"],
            }
            for item in monthly
        ]

        if not data:
            now = timezone.now()
            data = [
                {
                    "month": PERSIAN_MONTHS.get((now.month - i - 1) % 12 + 1, ""),
                    "value": 0,
                    "count": 0,
                }
                for i in range(5, -1, -1)
            ]

        return success_response(data)