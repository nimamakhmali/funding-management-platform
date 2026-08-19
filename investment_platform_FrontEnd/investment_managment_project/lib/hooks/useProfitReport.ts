import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/auth.store";
import {
  profitService,
  PayoutListParams,
} from "@/lib/api/services/profit.service";

export const PAYOUTS_KEY = (p?: PayoutListParams) =>
  ["investor", "payouts", p] as const;

export const PLATFORM_STATS_KEY = ["platform", "stats"] as const;

export function useMyPayouts(params?: PayoutListParams) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: PAYOUTS_KEY(params),
    queryFn: () => profitService.getMyPayouts(params),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function usePlatformStats() {
  return useQuery({
    queryKey: PLATFORM_STATS_KEY,
    queryFn: profitService.getPlatformStats,
    staleTime: 10 * 60 * 1000, // 10 دقیقه cache
  });
}