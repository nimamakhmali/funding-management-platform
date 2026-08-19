import {
  Download,
  ChartPie,
} from "lucide-react";

import { InvestDashboardTransactionTableItem } from "@/lib/types/investment-panel/invest-dashboard/InvestDashboardTransactionTable";

export const INVEST_DASHBOARD_TRANSACTIONS: InvestDashboardTransactionTableItem [] = [
  {
    id: 1,
    date: "۱۴۰۳/۰۲/۱۰",
    title: "واریز وجه",
    amount: "۵۰,۰۰۰,۰۰۰ ریال",
    status: "success",
    icon: <Download />,
  },

  {
    id: 2,
    date: "۱۴۰۳/۰۲/۰۸",
    title: "سود سهام",
    amount: "۲,۳۰۰,۰۰۰ ریال",
    status: "success",
    icon: <ChartPie />,
  },
];