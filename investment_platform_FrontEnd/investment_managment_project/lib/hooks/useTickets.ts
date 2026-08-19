import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ticketService,
  CreateTicketPayload,
  ReplyTicketPayload,
} from "@/lib/api/services/ticket.service";
import { useAuthStore } from "@/lib/store/auth.store";

// ── Query Keys ────────────────────────────────────────────────────────────────
export const TICKETS_KEY = (params?: object) =>
  ["tickets", params] as const;
export const TICKET_DETAIL_KEY = (id: string) =>
  ["ticket", "detail", id] as const;

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useTickets(params?: { page?: number; page_size?: number }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: TICKETS_KEY(params),
    queryFn: () => ticketService.getTickets(params),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useTicketDetail(id: string | null) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: TICKET_DETAIL_KEY(id ?? ""),
    queryFn: () => ticketService.getTicketById(id!),
    enabled: isAuthenticated && !!id,
    staleTime: 30 * 1000,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTicketPayload) =>
      ticketService.createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}

export function useReplyTicket(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReplyTicketPayload) =>
      ticketService.replyToTicket(ticketId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TICKET_DETAIL_KEY(ticketId),
      });
    },
  });
}

export function useCloseTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ticketService.closeTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}