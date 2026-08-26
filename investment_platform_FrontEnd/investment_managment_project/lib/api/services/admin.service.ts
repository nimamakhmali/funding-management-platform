import axiosInstance from "@/lib/api/orval/axios-instance";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AdminDashboardStats {
  total_users: number;
  total_invested: string;
  active_projects: number;
  today_transactions: number;
  today_volume: string;
  pending_projects: number;
}

export interface AdminRecentTransaction {
  id: string;
  reference_id: string;
  user: {
    name: string;
    phone_number: string;
  };
  type: string;
  type_display: string;
  amount: string;
  is_successful: boolean;
  created_at: string;
}

export interface AdminTransaction {
  id: string;
  user: {
    id: string;
    name: string;
    phone_number: string;
    initials: string;
  };
  type: string;
  type_display: string;
  amount: string;
  is_successful: boolean;
  reference_id: string;
  created_at: string;
}

export interface AdminTransactionFilters {
  page?: number;
  page_size?: number;
  type?: string;
  is_successful?: boolean;
  date_from?: string;
  date_to?: string;
  user_id?: string;
  min_amount?: number;
  max_amount?: number;
}

export interface PaginatedAdminTransactions {
  count: number;
  next: string | null;
  previous: string | null;
  total_pages: number;
  current_page: number;
  results: AdminTransaction[];
}

export interface AdminMonthlyChartItem {
  month: string;
  value: number;
  count: number;
}

export interface AdminUser {
  id: string;
  phone_number: string;
  role: string;
  is_active: boolean;
  created_at: string;
  profile?: {
    first_name?: string;
    last_name?: string;
    national_id?: string;
    email?: string;
    profile_type?: string;
  };
}

export interface PaginatedAdminUsers {
  count: number;
  next: string | null;
  previous: string | null;
  total_pages: number;
  current_page: number;
  results: AdminUser[];
}

export interface AdminUserFilters {
  page?: number;
  page_size?: number;
  q?: string;
  role?: string;
  is_active?: boolean;
}

export interface AdminProject {
  id: string;
  owner: {
    id: string;
    phone_number: string;
    username?: string;
  };
  title: string;
  category: string;
  category_display: string;
  required_budget: string;
  raised_amount: string;
  status: string;
  status_display: string;
  funding_percentage: string;
  investors_count: number;
  created_at: string;
}

export interface PaginatedAdminProjects {
  count: number;
  next: string | null;
  previous: string | null;
  total_pages: number;
  current_page: number;
  results: AdminProject[];
}

export interface AdminProjectFilters {
  page?: number;
  page_size?: number;
  q?: string;
  status?: string;
  category?: string;
}

export interface AdminTicket {
  id: string;
  user: {
    id: string;
    phone_number: string;
    full_name?: string;
  };
  subject: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
  messages_count?: number;
}

export interface PaginatedAdminTickets {
  count: number;
  next: string | null;
  previous: string | null;
  total_pages: number;
  current_page: number;
  results: AdminTicket[];
}

export interface AdminTicketFilters {
  page?: number;
  page_size?: number;
  status?: string;
  priority?: string;
  q?: string;
}

export interface AdminTicketDetail {
  id: string;
  user: {
    id: string;
    phone_number: string;
    full_name?: string;
    role?: string;
  };
  subject: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
  messages: Array<{
    id: string;
    sender: {
      id: string;
      phone_number: string;
      full_name?: string;
      is_admin?: boolean;
    };
    message: string;
    attachment_url?: string;
    created_at: string;
  }>;
}

export interface AdminProfitPeriod {
  id: string;
  project: {
    id: string;
    title: string;
  };
  title: string;
  calculation_date: string;
  total_profit_amount: string;
  status: string;
  distributed_at: string | null;
  payout_items_count?: number;
  created_at: string;
}

export interface PaginatedAdminProfitPeriods {
  count: number;
  next: string | null;
  previous: string | null;
  total_pages: number;
  current_page: number;
  results: AdminProfitPeriod[];
}

export interface AdminAuditLog {
  id: string;
  user: {
    id: string;
    phone_number: string;
    full_name?: string;
  } | null;
  action_type: string;
  details: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

export interface PaginatedAdminAuditLogs {
  count: number;
  next: string | null;
  previous: string | null;
  total_pages: number;
  current_page: number;
  results: AdminAuditLog[];
}

export interface AdminAuditLogFilters {
  page?: number;
  page_size?: number;
  action_type?: string;
  user_id?: string;
  date_from?: string;
  date_to?: string;
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

export const adminService = {
  // ── Dashboard ──────────────────────────────────────────────────────────────
  getDashboardStats: async (): Promise<AdminDashboardStats> => {
    const res = await axiosInstance.get("/admin/dashboard/stats/");
    return unwrap<AdminDashboardStats>(res);
  },

  getRecentTransactions: async (): Promise<AdminRecentTransaction[]> => {
    const res = await axiosInstance.get("/admin/transactions/recent/");
    return unwrap<AdminRecentTransaction[]>(res);
  },

  getMonthlyChart: async (): Promise<AdminMonthlyChartItem[]> => {
    const res = await axiosInstance.get("/admin/dashboard/chart/");
    return unwrap<AdminMonthlyChartItem[]>(res);
  },

  // ── Users ──────────────────────────────────────────────────────────────────
  getUsers: async (filters?: AdminUserFilters): Promise<PaginatedAdminUsers> => {
    const res = await axiosInstance.get("/admin/users/", { params: filters });
    return unwrap<PaginatedAdminUsers>(res);
  },

  getUserById: async (id: string): Promise<AdminUser> => {
    const res = await axiosInstance.get(`/admin/users/${id}/`);
    return unwrap<AdminUser>(res);
  },

  setUserActive: async (id: string, is_active: boolean): Promise<{ id: string; is_active: boolean }> => {
    const res = await axiosInstance.post(`/admin/users/${id}/set_active/`, { is_active });
    return unwrap<{ id: string; is_active: boolean }>(res);
  },

  // ── Projects ───────────────────────────────────────────────────────────────
  getProjects: async (filters?: AdminProjectFilters): Promise<PaginatedAdminProjects> => {
    const res = await axiosInstance.get("/projects/", { params: filters });
    return unwrap<PaginatedAdminProjects>(res);
  },

  changeProjectStatus: async (
    id: string,
    to_status: string,
    reason?: string,
  ): Promise<AdminProject> => {
    const res = await axiosInstance.post(`/projects/${id}/change_status/`, {
      to_status,
      reason,
    });
    return unwrap<AdminProject>(res);
  },

  // ── Transactions ───────────────────────────────────────────────────────────
  getTransactions: async (filters?: AdminTransactionFilters): Promise<PaginatedAdminTransactions> => {
    const res = await axiosInstance.get("/admin/transactions/", { params: filters });
    return unwrap<PaginatedAdminTransactions>(res);
  },

  // ── Tickets ────────────────────────────────────────────────────────────────
  getTickets: async (filters?: AdminTicketFilters): Promise<PaginatedAdminTickets> => {
    const res = await axiosInstance.get("/tickets/", { params: filters });
    return unwrap<PaginatedAdminTickets>(res);
  },

  getTicketById: async (id: string): Promise<AdminTicketDetail> => {
    const res = await axiosInstance.get(`/tickets/${id}/`);
    return unwrap<AdminTicketDetail>(res);
  },

  replyToTicket: async (id: string, message: string): Promise<{ id: string; created_at: string }> => {
    const res = await axiosInstance.post(`/tickets/${id}/reply/`, { message });
    return unwrap<{ id: string; created_at: string }>(res);
  },

  closeTicket: async (id: string): Promise<{ status: string }> => {
    const res = await axiosInstance.post(`/tickets/${id}/close/`);
    return unwrap<{ status: string }>(res);
  },

  // ── Profit Periods ─────────────────────────────────────────────────────────
  getProfitPeriods: async (params?: { page?: number }): Promise<PaginatedAdminProfitPeriods> => {
    const res = await axiosInstance.get("/profit-periods/", { params });
    return unwrap<PaginatedAdminProfitPeriods>(res);
  },

  calculateProfitPeriod: async (id: string): Promise<{ status: string; items_count: number }> => {
    const res = await axiosInstance.post(`/profit-periods/${id}/calculate/`);
    return unwrap<{ status: string; items_count: number }>(res);
  },

  approvePayout: async (id: string): Promise<{ status: string; transaction_id: string }> => {
    const res = await axiosInstance.post(`/payouts/${id}/approve/`);
    return unwrap<{ status: string; transaction_id: string }>(res);
  },

  // ── Audit Logs ─────────────────────────────────────────────────────────────
  getAuditLogs: async (filters?: AdminAuditLogFilters): Promise<PaginatedAdminAuditLogs> => {
    const res = await axiosInstance.get("/admin/audit-logs/", { params: filters });
    return unwrap<PaginatedAdminAuditLogs>(res);
  },
};