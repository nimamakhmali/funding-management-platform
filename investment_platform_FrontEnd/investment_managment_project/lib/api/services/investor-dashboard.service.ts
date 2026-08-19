import axiosInstance from "@/lib/api/orval/axios-instance";
import type {
  PaginatedProjects,
  ProjectListParams,
} from "./projects.service";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface WalletData {
  balance: string;
  blocked_amount: string;
  available_balance: string;
  updated_at: string;
}

export interface BackendTransaction {
  id: string;
  investment: string | null;
  amount: string;
  type:
    | "DEPOSIT"
    | "WITHDRAWAL"
    | "INVESTMENT_COMMITMENT"
    | "PROFIT"
    | "REFUND";
  reference_id: string;
  is_successful: boolean;
  created_at: string;
}

export interface PaginatedTransactions {
  count: number;
  next: string | null;
  previous: string | null;
  total_pages: number;
  current_page: number;
  results: BackendTransaction[];
}

export interface TransactionListParams {
  page?: number;
  page_size?: number;
  type?: string;
  success?: boolean;
}

export interface BackendInvestment {
  id: string;
  investor: { id: string; username: string; phone_number: string };
  project: string;
  project_title: string;
  amount: string;
  invest_date: string;
  status: "PENDING_PAYMENT" | "SUCCESSFUL" | "FAILED" | "REFUNDED";
  contract_file_url: string | null;
}

export interface PaymentInitiateResponse {
  payment_id: string;
  payment_url: string;
}

export interface InvestmentCreateRequest {
  project_id: string;
  amount: number;
}

export interface MyInvestment {
  id: string;
  project_id: string;
  project_title: string;
  project_status: string;
  project_status_display: string;
  project_cover_image: string | null;
  project_profit_rate: string;
  project_funding_percentage: string;
  amount: string;
  status: "PENDING_PAYMENT" | "SUCCESSFUL" | "FAILED" | "REFUNDED";
  invest_date: string;
  current_value: string;
}

export interface MyInvestmentDetail {
  project: {
    id: string;
    title: string;
    description: string;
    category_display: string;
    cover_image_url: string | null;
    required_budget: string;
    raised_amount: string;
    min_investment_amount: string;
    max_investment_amount: string;
    profit_rate_percentage: string;
    remaining_days: number;
    funding_percentage: string;
    investors_count: number;
    status: string;
    status_display: string;
    start_date: string | null;
    end_date: string | null;
  };
  my_investment: {
    id: string;
    amount: string;
    invest_date: string;
    status: string;
  } | null;
  profit_summary: {
    total_received: string;
    estimated_annual: string;
  };
}

export interface InvestorProfitSummary {
  total_received: string;
  total_received_count: number;
  pending_amount: string;
  pending_count: number;
  avg_roi_percentage: number;
}

// ── Helper ────────────────────────────────────────────────────────────────────
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

function unwrap<T>(response: { data: ApiResponse<T> | T }): T {
  const p = response.data;
  if (p && typeof p === "object" && "data" in p && "success" in p) {
    return (p as ApiResponse<T>).data;
  }
  return p as T;
}

// ── Service ───────────────────────────────────────────────────────────────────
export const investorService = {
  // ── کیف پول ──────────────────────────────────────────────────────────────
  getWallet: async (): Promise<WalletData> => {
    const res = await axiosInstance.get("/wallet/");
    return unwrap<WalletData>(res);
  },

  depositMock: async (amount: number): Promise<{ new_balance: string }> => {
    const res = await axiosInstance.post("/wallet/deposit/", { amount });
    return unwrap<{ new_balance: string }>(res);
  },

  initiatePayment: async (amount: number): Promise<PaymentInitiateResponse> => {
    const res = await axiosInstance.post("/wallet/payment/initiate/", { amount });
    return unwrap<PaymentInitiateResponse>(res);
  },

  requestWithdrawal: async (amount: number): Promise<BackendTransaction> => {
    const res = await axiosInstance.post("/wallet/withdraw/", { amount });
    return unwrap<BackendTransaction>(res);
  },

  // ── تراکنش‌ها ─────────────────────────────────────────────────────────────
  getTransactions: async (
    params?: TransactionListParams
  ): Promise<PaginatedTransactions> => {
    const res = await axiosInstance.get("/transactions/", { params });
    return unwrap<PaginatedTransactions>(res);
  },

  // ── سرمایه‌گذاری ──────────────────────────────────────────────────────────
  invest: async (data: InvestmentCreateRequest): Promise<BackendInvestment> => {
    const res = await axiosInstance.post("/invest/", data);
    return unwrap<BackendInvestment>(res);
  },

  // سرمایه‌گذاری‌های کاربر (قدیمی - از تراکنش‌ها)
  getMyInvestments: async (params?: {
    page?: number;
    page_size?: number;
  }): Promise<{ count: number; results: BackendInvestment[] }> => {
    const res = await axiosInstance.get("/transactions/", {
      params: { ...params, type: "INVESTMENT_COMMITMENT", success: true },
    });
    return unwrap<{ count: number; results: BackendInvestment[] }>(res);
  },

  // پروژه‌های قابل سرمایه‌گذاری
  getInvestableProjects: async (
    params?: ProjectListParams
  ): Promise<PaginatedProjects> => {
    const res = await axiosInstance.get("/projects/", {
      params: { ...params, status: "FUNDING" },
    });
    return unwrap<PaginatedProjects>(res);
  },

  // ── سرمایه‌گذاری‌های من (endpoint جدید) ──────────────────────────────────
  getMyInvestmentsList: async (params?: {
    page?: number;
    page_size?: number;
    status?: string;
  }): Promise<{
    count: number;
    total_pages: number;
    current_page: number;
    results: MyInvestment[];
  }> => {
    const res = await axiosInstance.get("/my-investments/", { params });
    return unwrap(res);
  },

  getMyInvestmentByProject: async (
    projectId: string
  ): Promise<MyInvestmentDetail> => {
    const res = await axiosInstance.get(`/my-investments/${projectId}/`);
    return unwrap(res);
  },

  // ── آمار سود ─────────────────────────────────────────────────────────────
  getProfitSummary: async (): Promise<InvestorProfitSummary> => {
    const res = await axiosInstance.get("/investor/profit-summary/");
    return unwrap(res);
  },
};