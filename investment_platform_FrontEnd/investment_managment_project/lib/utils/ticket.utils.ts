import type {
  BackendTicket,
  BackendTicketDetail,
  BackendTicketMessage,
  BackendTicketStatus,
  BackendTicketPriority,
} from "@/lib/api/services/ticket.service";
import type {
  Ticket,
  TicketStatus,
  TicketPriority,
} from "@/lib/types/investment-panel/ticket-management/Ticket";
import type {
  TicketDetail,
  TicketMessage,
} from "@/lib/types/investment-panel/ticket-management/TicketDetail";

// ── نگاشت وضعیت بک‌اند → فرانت ──────────────────────────────────────────────
const STATUS_MAP: Record<BackendTicketStatus, TicketStatus> = {
  OPEN: "open",
  USER_REPLIED: "in_progress",
  ADMIN_REPLIED: "in_progress",
  CLOSED: "closed",
};

const STATUS_LABEL: Record<BackendTicketStatus, string> = {
  OPEN: "باز",
  USER_REPLIED: "منتظر پاسخ",
  ADMIN_REPLIED: "پاسخ داده شده",
  CLOSED: "بسته شده",
};

// ── نگاشت اولویت بک‌اند → فرانت ─────────────────────────────────────────────
const PRIORITY_MAP: Record<BackendTicketPriority, TicketPriority> = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

// ── تبدیل تاریخ میلادی → شمسی ─────────────────────────────────────────────
function toJalali(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fa-IR");
}

// ── تبدیل پیام ───────────────────────────────────────────────────────────────
export function mapMessage(
  msg: BackendTicketMessage,
  currentUserId: string
): TicketMessage {
  const isUser = msg.sender.id === currentUserId;
  return {
    id: msg.id,
    sender: isUser ? "user" : "agent",
    authorName: msg.sender.username,
    time: new Date(msg.created_at).toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    dateTime: msg.created_at,
    text: msg.message,
    attachment: undefined,
  };
}

// ── تبدیل تیکت لیست ──────────────────────────────────────────────────────────
export function mapTicket(t: BackendTicket): Ticket {
  return {
    id: t.id.slice(0, 8).toUpperCase(),
    title: t.subject,
    department: "پشتیبانی",
    status: STATUS_MAP[t.status] ?? "open",
    priority: PRIORITY_MAP[t.priority] ?? "medium",
    createdAt: toJalali(t.created_at),
    updatedAt: toJalali(t.updated_at),
  };
}

// ── تبدیل تیکت جزئیات ────────────────────────────────────────────────────────
export function mapTicketDetail(
  t: BackendTicketDetail,
  currentUserId: string
): TicketDetail {
  return {
    id: t.id,
    subject: t.subject,
    status: STATUS_MAP[t.status] ?? "open",
    statusLabel: STATUS_LABEL[t.status] ?? "باز",
    priority: PRIORITY_MAP[t.priority] ?? "medium",
    createdAt: toJalali(t.created_at),
    updatedAt: toJalali(t.updated_at),
    createdDateTime: t.created_at,
    messages: t.messages.map((m) => mapMessage(m, currentUserId)),
  };
}