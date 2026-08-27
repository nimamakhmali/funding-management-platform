import { TicketFilterOption } from
  "@/lib/types/admin/admin-ticket-management/AdminTicketFilterOption";

export const TICKET_FILTERS = {
  status: <TicketFilterOption[]>[
    { label: "همه وضعیت‌ها", value: "all" },
    { label: "باز", value: "OPEN" },
    { label: "در حال بررسی", value: "IN_PROGRESS" },
    { label: "بسته شده", value: "CLOSED" },
    { label: "پاسخ کاربر", value: "USER_REPLIED" },
    { label: "پاسخ ادمین", value: "ADMIN_REPLIED" },
  ],

  priority: <TicketFilterOption[]>[
    { label: "همه اولویت‌ها", value: "all" },
    { label: "بالا", value: "HIGH" },
    { label: "متوسط", value: "MEDIUM" },
    { label: "پایین", value: "LOW" },
  ],

  category: <TicketFilterOption[]>[
    { label: "فنی", value: "technical" },
    { label: "مالی", value: "financial" },
    { label: "احراز هویت", value: "identity" },
  ],
};