import { useQuery } from "@tanstack/react-query";
import {
  ownerDashboardService,
  OwnerDashboardData,
  MonthlyChartItem,
} from "@/lib/api/services/owner-dashboard.service";
import {
  PaginatedProjects,
  ProjectListParams,
} from "@/lib/api/services/projects.service";
import { useAuthStore } from "@/lib/store/auth.store";

// ── Query Keys ────────────────────────────────────────────────────────────────
export const OWNER_DASHBOARD_KEY = ["owner", "dashboard"] as const;

export const MY_PROJECTS_KEY = (params?: ProjectListParams) =>
  ["owner", "my-projects", params] as const;

export const PROJECT_DETAIL_KEY = (id: string) =>
  ["project", "detail", id] as const;

// ── Hooks ─────────────────────────────────────────────────────────────────────



// hook جدید برای chart
export function useOwnerMonthlyStats() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery<MonthlyChartItem[]>({
    queryKey: ["owner", "monthly-stats"],
    queryFn: () => ownerDashboardService.getMonthlyStats(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}


/**
 * داشبورد کامل صاحب طرح
 */
export function useOwnerDashboard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.role);
  const isOwner =
    role === "ENTREPRENEUR" || role === "PROJECT_OWNER";

  return useQuery<OwnerDashboardData>({
    queryKey: OWNER_DASHBOARD_KEY,
    queryFn: ownerDashboardService.getDashboard,
    enabled: isAuthenticated && isOwner,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * پروژه‌های من با pagination و فیلتر
 */
export function useMyProjects(params?: ProjectListParams) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery<PaginatedProjects>({
    queryKey: MY_PROJECTS_KEY(params),
    queryFn: () => ownerDashboardService.getMyProjects(params),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

/**
 * جزئیات یک پروژه
 */
export function useProjectDetail(id: string | null) {
  return useQuery<import("@/lib/api/services/projects.service").BackendProject>({
    queryKey: PROJECT_DETAIL_KEY(id ?? ""),
    queryFn: () => ownerDashboardService.getProjectDetail(id!),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

