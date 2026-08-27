import axiosInstance from "@/lib/api/orval/axios-instance";

// ── Types بک‌اند ──────────────────────────────────────────────────────────────

export type BackendTicketStatus =
  | "OPEN"
  | "USER_REPLIED"
  | "ADMIN_REPLIED"
  | "IN_PROGRESS"
  | "CLOSED";

export type BackendTicketPriority = "LOW" | "MEDIUM" | "HIGH";

export interface BackendTicketSender {
  id: string;
  phone_number: string;
  full_name?: string;
  // backend ممکن است is_staff یا role بفرستد
  is_admin?: boolean;
  role?: string;
}

export interface BackendTicketMessage {
  id: string;
  sender: BackendTicketSender;
  message: string;
  attachment_url: string | null;
  created_at: string;
}

export interface BackendTicketUser {
  id: string;
  phone_number: string;
  full_name?: string;
  role?: string;
}

export interface BackendTicket {
  id: string;
  user: BackendTicketUser;
  subject: string;
  priority: BackendTicketPriority;
  status: BackendTicketStatus;
  created_at: string;
  updated_at: string;
  messages_count?: number;
}

export interface BackendTicketDetail extends BackendTicket {
  messages: BackendTicketMessage[];
}

export interface PaginatedTickets {
  count: number;
  next: string | null;
  previous: string | null;
  total_pages: number;
  current_page: number;
  results: BackendTicket[];
}

export interface CreateTicketPayload {
  subject: string;
  priority: BackendTicketPriority;
  message: string;
}

export interface ReplyTicketPayload {
  message: string;
  attachment_url?: string;
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
export const ticketService = {
  getTickets: async (params?: {
    page?: number;
    page_size?: number;
    status?: string;
    priority?: string;
  }): Promise<PaginatedTickets> => {
    const res = await axiosInstance.get("/tickets/", { params });
    return unwrap<PaginatedTickets>(res);
  },

  getTicketById: async (id: string): Promise<BackendTicketDetail> => {
    const res = await axiosInstance.get(`/tickets/${id}/`);
    return unwrap<BackendTicketDetail>(res);
  },

  createTicket: async (
    data: CreateTicketPayload
  ): Promise<BackendTicketDetail> => {
    const res = await axiosInstance.post("/tickets/", data);
    return unwrap<BackendTicketDetail>(res);
  },

  replyToTicket: async (
    id: string,
    data: ReplyTicketPayload
  ): Promise<{ id: string; created_at: string }> => {
    const res = await axiosInstance.post(`/tickets/${id}/reply/`, data);
    return unwrap<{ id: string; created_at: string }>(res);
  },

  closeTicket: async (id: string): Promise<void> => {
    await axiosInstance.post(`/tickets/${id}/close/`);
  },

  deleteTicket: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/tickets/${id}/`);
  },
};