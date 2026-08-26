from django.urls import path
from .admin_views import (
    AdminDashboardStatsView,
    AdminTransactionListView,
    AdminRecentTransactionsView,
    AdminMonthlyChartView,
)

urlpatterns = [
    path("admin/dashboard/stats/", AdminDashboardStatsView.as_view(), name="admin-dashboard-stats"),
    path("admin/transactions/", AdminTransactionListView.as_view(), name="admin-transactions"),
    path("admin/transactions/recent/", AdminRecentTransactionsView.as_view(), name="admin-recent-transactions"),
    path("admin/dashboard/chart/", AdminMonthlyChartView.as_view(), name="admin-dashboard-chart"),
]