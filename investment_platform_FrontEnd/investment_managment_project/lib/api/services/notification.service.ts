// lib/api/services/notification.service.ts
import axiosInstance from "@/lib/api/orval/axios-instance";

export interface BackendNotification {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "WARNING" | "SUCCESS" | "ERROR";
  is_read: boolean;
  created_at: string;
  read_at: string | null;
}

export interface PaginatedNotifications {
  count: number;
  next: string | null;
  previous: string | null;
  total_pages: number;
  current_page: number;
  results: BackendNotification[];
}

interface ApiResponse<T> { success: boolean; data: T; }
function unwrap<T>(res: { data: ApiResponse<T> | T }): T {
  const p = res.data;
  if (p && typeof p === "object" && "data" in p && "success" in p)
    return (p as ApiResponse<T>).data;
  return p as T;
}

export const notificationService = {
  getNotifications: async (params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedNotifications> => {
    const res = await axiosInstance.get("/notifications/", { params });
    return unwrap<PaginatedNotifications>(res);
  },

  markAsRead: async (id: string): Promise<void> => {
    await axiosInstance.post(`/notifications/${id}/read/`);
  },
};