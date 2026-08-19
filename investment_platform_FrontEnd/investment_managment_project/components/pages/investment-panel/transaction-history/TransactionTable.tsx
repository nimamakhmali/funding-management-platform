"use client";
import { Column, ReusableTable } from "@/components/ui/ReusableTable";
import { separateThousands } from "@/lib/utils/separateThousands";
import { Eye } from "lucide-react";
import { ReactNode } from "react";
import TransactionStatus from "./TransactionStatus";
import TransactionType from "./TransactionType";

type InvestProject = {
  id: string;
  date: string;
  trackingCode: string;
  transactionType: "deposit" | "withdrawal";
  price: string;
  statue: "success" | "pending" | "failed";
  action: ReactNode;
};

export default function TransactionTable() {
  // TODO:Remove this sample data later
  const sampleData: InvestProject[] = [
    {
      id: "1",
      date: "۱۴۰۳/۰۹/۱۵",
      trackingCode: "TRX-۱۲۳۴۵۶۷۸",
      transactionType: "deposit",
      price: "2500000",
      statue: "success",
      action: null,
    },
    {
      id: "2",
      date: "۱۴۰۳/۰۹/۱۴",
      trackingCode: "TRX-۲۳۴۵۶۷۸۹",
      transactionType: "withdrawal",
      price: "500000000",
      statue: "pending",
      action: null,
    },
    {
      id: "3",
      date: "۱۴۰۳/۰۹/۱۳",
      trackingCode: "TRX-۳۴۵۶۷۸۹۰",
      transactionType: "deposit",
      price: "12000000",
      statue: "failed",
      action: null,
    },
  ];

  const columns: Column<InvestProject>[] = [
    {
      header: "تاریخ و ساعت",
      accessor: (row) => (
        <div className="flex flex-col gap-1">
          <span>{row.date}</span>
          <span>۱۲:۳۰:۴۵</span>
        </div>
      ),
    },
    {
      header: "کد پیگیری",
      accessor: (row) => (
        <span className="py-2 px-3 bg-gray-50/50 text-xs font-bold uppercase tracking-wide">
          {row.trackingCode}
        </span>
      ),
    },
    {
      header: "نوع تراکنش",
      accessor: (row) => (
        <TransactionType transactionType={row.transactionType} />
      ),
    },
    {
      header: "مبلغ (ریال)",
      accessor: (row) => <>{separateThousands(row.price)}</>,
    },
    {
      header: "وضعیت",
      accessor: (row) => <TransactionStatus status={row.statue} />,
    },
    {
      header: "اقدام",
      accessor: () => (
        <button className="text-text-sub hover:text-gray-50 p-2 hover:bg-primary-light rounded-xl transition-all cursor-pointer">
          <Eye />
        </button>
      ),
    },
  ];

  return (
    <ReusableTable
      data={sampleData}
      emptyMessage="تراکنشی یافت نشد"
      columns={columns}
      enableSort
      title=""
    />
  );
}
