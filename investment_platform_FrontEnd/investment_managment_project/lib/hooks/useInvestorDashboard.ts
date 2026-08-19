import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  investorService,
  TransactionListParams,
} from "@/lib/api/services/investor-dashboard.service";
import { ProjectListParams } from "@/lib/api/services/projects.service";
import { useAuthStore } from "@/lib/store/auth.store";

// ── Query Keys ────────────────────────────────────────────────────────────────
export const WALLET_KEY = ["investor", "wallet"] as const;
export const TRANSACTIONS_KEY = (p?: TransactionListParams) =>
  ["investor", "transactions", p] as const;
export const INVESTABLE_PROJECTS_KEY = (p?: ProjectListParams) =>
  ["investor", "investable-projects", p] as const;
export const MY_INVESTMENTS_KEY = (p?: object) =>
  ["investor", "my-investments", p] as const;

export const MY_INVESTMENTS_LIST_KEY = (p?: object) =>
  ["investor", "my-investments-list", p] as const;

export const INVESTMENT_DETAIL_KEY = (projectId: string) =>
  ["investor", "investment-detail", projectId] as const;

export const PROFIT_SUMMARY_KEY = ["investor", "profit-summary"] as const;



// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useWallet() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: WALLET_KEY,
    queryFn: investorService.getWallet,
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  });
}

export function useTransactions(params?: TransactionListParams) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: TRANSACTIONS_KEY(params),
    queryFn: () => investorService.getTransactions(params),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useInvestableProjects(params?: ProjectListParams) {
  return useQuery({
    queryKey: INVESTABLE_PROJECTS_KEY(params),
    queryFn: () => investorService.getInvestableProjects(params),
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useMyInvestments(params?: { page?: number; page_size?: number }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: MY_INVESTMENTS_KEY(params),
    queryFn: () => investorService.getMyInvestments(params),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });
}

export function useWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) =>
      investorService.requestWithdrawal(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WALLET_KEY });
      queryClient.invalidateQueries({ queryKey: ["investor", "transactions"] });
    },
  });
}

export function useInvest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: investorService.invest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WALLET_KEY });
      queryClient.invalidateQueries({ queryKey: ["investor", "transactions"] });
      queryClient.invalidateQueries({ queryKey: ["investor", "my-investments"] });
    },
  });
}

export function useInitiatePayment() {
  return useMutation({
    mutationFn: (amount: number) =>
      investorService.initiatePayment(amount),
    onSuccess: (data) => {
      // redirect به درگاه پرداخت
      if (data.payment_url) {
        window.location.href = data.payment_url;
      }
    },
  });
}


export function useMyInvestmentsList(params?: {
  page?: number;
  page_size?: number;
  status?: string;
}) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: MY_INVESTMENTS_LIST_KEY(params),
    queryFn: () => investorService.getMyInvestmentsList(params),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useMyInvestmentByProject(projectId: string) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: INVESTMENT_DETAIL_KEY(projectId),
    queryFn: () => investorService.getMyInvestmentByProject(projectId),
    enabled: isAuthenticated && !!projectId,
    staleTime: 60 * 1000,
  });
}

export function useInvestorProfitSummary() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: PROFIT_SUMMARY_KEY,
    queryFn: investorService.getProfitSummary,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });
}
