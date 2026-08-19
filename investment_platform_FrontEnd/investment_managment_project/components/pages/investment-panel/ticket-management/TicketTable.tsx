"use client";

import { Column, ReusableTable } from "@/components/ui/ReusableTable";

import { Ticket } from "@/lib/types/investment-panel/ticket-management/Ticket";
import TicketStatusBadge from "./TicketStatusBadge";
import TicketPriorityBadge from "./TicketPriorityBadge";
import TicketTableActions from "./TicketTableActions";

export default function TicketTable({ data }: { data: Ticket[] }) {
  const columns: Column<Ticket>[] = [
    {
      header: "شناسه",
      accessor: (row) => (
        <span className="text-sm font-medium text-gray-400 font-display">
          {row.id}
        </span>
      ),
      cellClassName: "px-6 py-4 whitespace-nowrap",
    },
    {
      header: "عنوان تیکت",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-[#131118]">{row.title}</span>
          <span className="text-xs text-gray-400 mt-0.5">
            {row.department}
          </span>
        </div>
      ),
      cellClassName: "px-6 py-4 whitespace-nowrap",
    },
    {
      header: "وضعیت",
      accessor: (row) => <TicketStatusBadge status={row.status} />,
      filterable: true,
      filterType: "select",
      filterOptions: [
        { value: "open", label: "باز" },
        { value: "in_progress", label: "در حال انجام" },
        { value: "closed", label: "بسته شده" },
      ],
      cellClassName: "px-6 py-4 whitespace-nowrap",
    },
    {
      header: "اولویت",
      accessor: (row) => <TicketPriorityBadge priority={row.priority} />,
      cellClassName: "px-6 py-4 whitespace-nowrap",
    },
    {
      header: "تاریخ ایجاد",
      accessor: (row) => (
        <span className="text-sm text-gray-600 font-display">
          {row.createdAt}
        </span>
      ),
      cellClassName: "px-6 py-4 whitespace-nowrap",
    },
    {
      header: "آخرین بروزرسانی",
      accessor: (row) => (
        <span className="text-sm text-gray-500 font-display">
          {row.updatedAt}
        </span>
      ),
      cellClassName: "px-6 py-4 whitespace-nowrap",
    },
    {
      header: "اقدام",
      accessor: (row) => <TicketTableActions ticketId={row.id} />,
      cellClassName: "px-6 py-4 whitespace-nowrap text-center",
    },
  ];

  return (
    <ReusableTable
      data={data}
      columns={columns}
      enableFilter={false}
      enablePagination
      itemsPerPage={8}
    />
  );
}
