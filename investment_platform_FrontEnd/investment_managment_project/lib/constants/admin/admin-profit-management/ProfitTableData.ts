import { AdminProfitTableRow} from "@/lib/types/admin/admin-profit-management/AdminProfitTable";

export const profitTableData: AdminProfitTableRow[] = [
  {
    id: "1",
    title: "پاییز ۱۴۰۲ - مرحله اول",
    period: "۰۱ مهر تا ۳۰ آذر",
    amount: 12500000000,
    investors: 482,
    calculationStatus: "calculated",
    approveStatus: "approved",
  },
  {
    id: "2",
    title: "دی ماه ۱۴۰۲ - ماهانه",
    period: "۰۱ دی تا ۳۰ دی",
    amount: 8200000000,
    investors: 125,
    calculationStatus: "calculated",
    approveStatus: "pending",
  },
  {
    id: "3",
    title: "طرح ویژه نوسازی",
    period: "۱۵ آذر تا ۱۵ دی",
    amount: 15400000000,
    investors: 89,
    calculationStatus: "processing",
    approveStatus: "unknown",
  },
];