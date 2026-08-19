import {
 FolderKanban,
  MessagesSquare,
  Settings,
  BookDashed,
  FileChartColumn,
  User,
  CreditCard
} from "lucide-react";


export const ADMIN_SIDEBAR = [
  {
    id: "dashboard-admin",
    href: "/admin-dashboard",
    title: "داشبورد",
    icon: BookDashed,
  },

  {
    id: "admin-project-management",
    href: "/admin-project-management",
    title: "پروژه ها",
    icon: FolderKanban,
  },

  {
    id: "admin-user-management",
    href: "/admin-user-management",
    title: "کاربران",
    icon: User,
  },

  {
    id: "admin-profit-distribution-management",
    href: "/admin-profit-distribution-management",
    title: "گزارش ها",
    icon: FileChartColumn,
  }, 
   {
    id: "admin-transaction-management",
    href: "/admin-transaction-management",
    title: "تراکنش ها",
    icon: CreditCard,
  },

   {
    id: "admin-system-activity-report-manegement",
    href: "/admin-system-activity-report-manegement",
    title: "گزارش فعالیت های سیستم",
    icon: Settings,
  },

  {
    id: "admin-ticket-manegement",
    href: "/admin-ticket-manegement",
    title: "تیکت",
    icon: MessagesSquare,
  },

  {
    id: "admin-account-settings",
    href: "/admin-account-settings",
    title: "تنظیمات",
    icon: Settings,
  },
];