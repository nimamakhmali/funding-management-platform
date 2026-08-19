import axiosInstance from "@/lib/api/orval/axios-instance";

// ── Types ─────────────────────────────────────────────────────────────────────

export type PayoutStatus = "PENDING" | "PAID_TO_WALLET" | "SETTLED_SEJAM";

export interface InvestorPayout {
  id: string;
  period_title: string;
  project_id: string;
  project_name: string;
  amount: string;
  status: PayoutStatus;
  paid_at: string | null;
  created_at: string;
}

export interface PaginatedPayouts {
  count: number;
  next: string | null;
  previous: string | null;
  total_pages: number;
  current_page: number;
  results: InvestorPayout[];
}

export interface PayoutListParams {
  page?: number;
  page_size?: number;
  project_id?: string;
  status?: PayoutStatus;
}

export interface PlatformStats {
  total_investors: number;
  successful_projects: number;
  total_funded_amount: string;
  avg_profit_rate: number;
  active_funding_projects: number;
}

// ── Helper ────────────────────────────────────────────────────────────────────
interface ApiResponse<T> { success: boolean; data: T; }

function unwrap<T>(response: { data: ApiResponse<T> | T }): T {
  const p = response.data;
  if (p && typeof p === "object" && "data" in p && "success" in p) {
    return (p as ApiResponse<T>).data;
  }
  return p as T;
}

// ── Service ───────────────────────────────────────────────────────────────────
export const profitService = {
  // سودهای سرمایه‌گذار
  getMyPayouts: async (params?: PayoutListParams): Promise<PaginatedPayouts> => {
    const res = await axiosInstance.get("/investor/payouts/", { params });
    return unwrap<PaginatedPayouts>(res);
  },

  // آمار پلتفرم (عمومی)
  getPlatformStats: async (): Promise<PlatformStats> => {
    const res = await axiosInstance.get("/projects/platform-stats/");
    return unwrap<PlatformStats>(res);
  },
};