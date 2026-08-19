import { TicketFilterOption } from 
"@/lib/types/admin/admin-ticket-management/AdminTicketFilterOption";

export const TICKET_FILTERS = {
  status: <TicketFilterOption[]>[
    {
      label: "همه وضعیت‌ها",
      value: "all",
    },
    {
      label: "در انتظار پاسخ",
      value: "waiting",
    },
    {
      label: "در حال بررسی",
      value: "processing",
    },
    {
      label: "بسته شده",
      value: "closed",
    },
  ],

  priority: <TicketFilterOption[]>[
    {
      label: "همه اولویت‌ها",
      value: "all",
    },
    {
      label: "فوری",
      value: "urgent",
    },
    {
      label: "بالا",
      value: "high",
    },
    {
      label: "متوسط",
      value: "medium",
    },
  ],

  category: <TicketFilterOption[]>[
    {
      label: "فنی",
      value: "technical",
    },
    {
      label: "مالی",
      value: "financial",
    },
    {
      label: "احراز هویت",
      value: "identity",
    },
  ],
};