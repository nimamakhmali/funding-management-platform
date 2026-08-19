"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/auth.store";
import {
  ownerDashboardService,
  OwnerReportParams,
  OwnerReportData,
} from "@/lib/api/services/owner-dashboard.service";

export const OWNER_REPORTS_KEY = (p?: OwnerReportParams) =>
  ["owner", "reports", p] as const;

export function useOwnerReports(params?: OwnerReportParams) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery<OwnerReportData>({
    queryKey: OWNER_REPORTS_KEY(params),
    queryFn: () => ownerDashboardService.getReports(params),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}