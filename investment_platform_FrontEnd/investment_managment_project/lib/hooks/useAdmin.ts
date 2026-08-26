import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminService,
  AdminUserFilters,
  AdminProjectFilters,
  AdminTransactionFilters,
  AdminTicketFilters,
  AdminAuditLogFilters,
} from "@/lib/api/services/admin.service";

// ── Query Keys ────────────────────────────────────────────────────────────────

export const ADMIN_KEYS = {
  dashboardStats: ["admin", "dashboard", "stats"] as const,
  recentTransactions: ["admin", "dashboard", "recent-transactions"] as const,
  monthlyChart: ["admin", "dashboard", "chart"] as const,
  users: (filters?: AdminUserFilters) => ["admin", "users", filters] as const,
  user: (id: string) => ["admin", "users", id] as const,
  projects: (filters?: AdminProjectFilters) => ["admin", "projects", filters] as const,
  transactions: (filters?: AdminTransactionFilters) => ["admin", "transactions", filters] as const,
  tickets: (filters?: AdminTicketFilters) => ["admin", "tickets", filters] as const,
  ticket: (id: string) => ["admin", "tickets", id] as const,
  profitPeriods: (params?: object) => ["admin", "profit-periods", params] as const,
  auditLogs: (filters?: AdminAuditLogFilters) => ["admin", "audit-logs", filters] as const,
};

// ── Dashboard ─────────────────────────────────────────────────────────────────

export function useAdminDashboardStats() {
  return useQuery({
    queryKey: ADMIN_KEYS.dashboardStats,
    queryFn: () => adminService.getDashboardStats(),
    staleTime: 60 * 1000,
  });
}

export function useAdminRecentTransactions() {
  return useQuery({
    queryKey: ADMIN_KEYS.recentTransactions,
    queryFn: () => adminService.getRecentTransactions(),
    staleTime: 30 * 1000,
  });
}

export function useAdminMonthlyChart() {
  return useQuery({
    queryKey: ADMIN_KEYS.monthlyChart,
    queryFn: () => adminService.getMonthlyChart(),
    staleTime: 5 * 60 * 1000,
  });
}

// ── Users ─────────────────────────────────────────────────────────────────────

export function useAdminUsers(filters?: AdminUserFilters) {
  return useQuery({
    queryKey: ADMIN_KEYS.users(filters),
    queryFn: () => adminService.getUsers(filters),
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useSetUserActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      adminService.setUserActive(id, is_active),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

// ── Projects ──────────────────────────────────────────────────────────────────

export function useAdminProjects(filters?: AdminProjectFilters) {
  return useQuery({
    queryKey: ADMIN_KEYS.projects(filters),
    queryFn: () => adminService.getProjects(filters),
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useAdminChangeProjectStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      to_status,
      reason,
    }: {
      id: string;
      to_status: string;
      reason?: string;
    }) => adminService.changeProjectStatus(id, to_status, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "projects"] });
    },
  });
}

// ── Transactions ──────────────────────────────────────────────────────────────

export function useAdminTransactions(filters?: AdminTransactionFilters) {
  return useQuery({
    queryKey: ADMIN_KEYS.transactions(filters),
    queryFn: () => adminService.getTransactions(filters),
    staleTime: 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

// ── Tickets ───────────────────────────────────────────────────────────────────

export function useAdminTickets(filters?: AdminTicketFilters) {
  return useQuery({
    queryKey: ADMIN_KEYS.tickets(filters),
    queryFn: () => adminService.getTickets(filters),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useAdminTicketDetail(id: string) {
  return useQuery({
    queryKey: ADMIN_KEYS.ticket(id),
    queryFn: () => adminService.getTicketById(id),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

export function useAdminReplyTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      adminService.replyToTicket(id, message),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ADMIN_KEYS.ticket(id) });
      qc.invalidateQueries({ queryKey: ["admin", "tickets"] });
    },
  });
}

export function useAdminCloseTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.closeTicket(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "tickets"] });
    },
  });
}

// ── Profit Periods ────────────────────────────────────────────────────────────

export function useAdminProfitPeriods(params?: { page?: number }) {
  return useQuery({
    queryKey: ADMIN_KEYS.profitPeriods(params),
    queryFn: () => adminService.getProfitPeriods(params),
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useCalculateProfitPeriod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.calculateProfitPeriod(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "profit-periods"] });
    },
  });
}

export function useApprovePayout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.approvePayout(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "profit-periods"] });
    },
  });
}

// ── Audit Logs ────────────────────────────────────────────────────────────────

export function useAdminAuditLogs(filters?: AdminAuditLogFilters) {
  return useQuery({
    queryKey: ADMIN_KEYS.auditLogs(filters),
    queryFn: () => adminService.getAuditLogs(filters),
    staleTime: 60 * 1000,
    placeholderData: (prev) => prev,
  });
}