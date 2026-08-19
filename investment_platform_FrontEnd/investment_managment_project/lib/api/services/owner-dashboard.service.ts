import axiosInstance from "@/lib/api/orval/axios-instance";
import {
  PaginatedProjects,
  ProjectListParams,
  BackendProject,
} from "./projects.service";

// ── Types منطبق دقیق با بک‌اند ───────────────────────────────────────────────

export interface OwnerDashboardStats {
  total_projects: number;
  active_projects: number;
  total_raised: string;
  expected_profit: string;
  realized_profit: string;
  roi_percentage: number;
}

export interface MostActiveProject {
  id: string;
  title: string;
  status: string;
  status_display: string;
  required_budget: string;
  raised_amount: string;
  progress: number;
  investors_count: number;
  remaining_days: number;
  cover_image_url: string | null;
}

export interface OwnerDashboardData {
  stats: OwnerDashboardStats;
  most_active_project: MostActiveProject | null;
}


// اضافه به انتهای فایل - بعد از ownerDashboardService

export interface OwnerReportStats {
  total_projects: number;
  active_projects: number;
  total_raised: string;
  total_required: string;
  avg_progress: number;
  total_profit_paid: string;
}

export interface OwnerReportTableRow {
  id: string;
  project_name: string;
  start_date: string;
  target_amount: string;
  raised_amount: string;
  progress: number;
  status: string;
  status_code: string;
  investors_count: number;
  profit_rate: string;
}

export interface OwnerReportChartItem {
  status: string;
  status_display: string;
  count: number;
}

export interface OwnerComparisonChartItem {
  name: string;
  target: number;
  raised: number;
  progress: number;
}

export interface OwnerReportData {
  stats: OwnerReportStats;
  table: OwnerReportTableRow[];
  status_chart: OwnerReportChartItem[];
  comparison_chart: OwnerComparisonChartItem[];
}

export interface OwnerReportParams {
  date_from?: string;
  date_to?: string;
  project_id?: string;
  report_type?: string;
}


// ── Helper ────────────────────────────────────────────────────────────────────
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

function unwrap<T>(response: { data: ApiResponse<T> | T }): T {
  const p = response.data;
  if (
    p &&
    typeof p === "object" &&
    "data" in p &&
    "success" in p
  ) {
    return (p as ApiResponse<T>).data;
  }
  return p as T;
}

// ── Service ───────────────────────────────────────────────────────────────────
export const ownerDashboardService = {
  /**
   * داشبورد کامل صاحب طرح
   * GET /api/v1/projects/owner-dashboard/
   */
  getDashboard: async (): Promise<OwnerDashboardData> => {
    const res = await axiosInstance.get("/projects/owner-dashboard/");
    return unwrap<OwnerDashboardData>(res);
  },

  /**
   * پروژه‌های من
   * GET /api/v1/projects/?my_projects=true
   * توجه: پارامتر my_projects است نه mine
   */
  getMyProjects: async (
    params?: ProjectListParams
  ): Promise<PaginatedProjects> => {
    const res = await axiosInstance.get("/projects/", {
      params: {
        ...params,
        my_projects: true,  // ← بک‌اند این پارامتر را انتظار دارد
      },
    });
    return unwrap<PaginatedProjects>(res);
  },

  /**
   * جزئیات یک پروژه خاص
   * GET /api/v1/projects/{id}/
   */
  getProjectDetail: async (id: string): Promise<BackendProject> => {
    const res = await axiosInstance.get(`/projects/${id}/`);
    return unwrap<BackendProject>(res);
  },

  getReports: async (params?: OwnerReportParams): Promise<OwnerReportData> => {
    const res = await axiosInstance.get("/projects/owner-reports/", { params });
    return unwrap<OwnerReportData>(res);
  },

};


// در انتهای فایل اضافه کن

export interface MonthlyChartItem {
  month: string;
  value: number;
}

// داخل ownerDashboardService اضافه کن:
export const ownerDashboardService = {
  // ... متدهای موجود ...

  getMonthlyStats: async (): Promise<MonthlyChartItem[]> => {
    const res = await axiosInstance.get("/projects/owner-monthly-stats/");
    return unwrap<MonthlyChartItem[]>(res);
  },
};