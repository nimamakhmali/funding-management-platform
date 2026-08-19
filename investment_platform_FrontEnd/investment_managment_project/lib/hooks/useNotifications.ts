// lib/hooks/useNotifications.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/lib/api/services/notification.service";
import { useAuthStore } from "@/lib/store/auth.store";

export const NOTIFICATIONS_KEY = ["notifications"] as const;

export function useNotifications(params?: { page?: number; page_size?: number }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: [...NOTIFICATIONS_KEY, params],
    queryFn: () => notificationService.getNotifications(params),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
    },
  });
}