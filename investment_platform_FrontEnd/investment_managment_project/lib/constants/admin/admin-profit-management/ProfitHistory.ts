import { AdminProfitHistoryItem, AdminProfitSupervisor } 
from "@/lib/types/admin/admin-profit-management/AdminProfitHistory";

export const profitHistory: AdminProfitHistoryItem[] = [
  {
    id: 1,
    title: "تایید نهایی دوره پاییزی",
    description: "توسط علی محمدی • ۳ ساعت پیش",
    active: true,
  },
  {
    id: 2,
    title: "پایان محاسبه خودکار سیستم",
    description: "دیروز",
  },
];

export const profitSupervisors: AdminProfitSupervisor[] = [
  {
    id: 1,
    name: "م.ح",
  },
  {
    id: 2,
    name: "ع.م",
  },
  {
    id: 3,
    name: "س.ر",
  },
];