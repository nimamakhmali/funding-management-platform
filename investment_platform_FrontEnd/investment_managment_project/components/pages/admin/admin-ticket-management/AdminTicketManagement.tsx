// components/pages/admin/admin-ticket-management/AdminTicketManagement.tsx
"use client";

import { useForm } from "react-hook-form";
import { UserPlus, Lock, Loader2 } from "lucide-react";
import { FormScrollableSelectField } from "@/components/ui/FormScrollableSelectField";
import { TicketAssignee, TicketStatusOption } from "@/lib/types/admin/admin-ticket-management/ticket.userInfo";
import { useAdminCloseTicket } from "@/lib/hooks/useAdmin";

interface Props {
  statuses: TicketStatusOption[];
  assignees: TicketAssignee[];
  ticketId: string;
}

interface FormValues {
  status: string;
  assignee: number | null;
}

export default function TicketManagement({ statuses, assignees, ticketId }: Props) {
  const { control, getValues } = useForm<FormValues>({
    defaultValues: { status: "OPEN", assignee: null },
  });

  const closeMutation = useAdminCloseTicket();

  const handleClose = async () => {
    if (!ticketId) return;
    try {
      await closeMutation.mutateAsync(ticketId);
    } catch {
      // خطا مدیریت می‌شود
    }
  };

  const handleAssign = () => {
    const values = getValues();
    console.log("Assign ticket:", ticketId, "to:", values.assignee, "status:", values.status);
    // TODO: در صورت وجود API برای assign، اینجا mutation اضافه می‌شود
    alert(`تیکت با وضعیت "${values.status}" به‌روز شد`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
      <h4 className="font-bold text-sm border-b border-b-gray-100 pb-3">
        کنترل و مدیریت تیکت
      </h4>
      <div className="space-y-4">
        <FormScrollableSelectField
          control={control}
          name="status"
          label="تغییر وضعیت تیکت"
          options={statuses}
          getOptionLabel={(item) => item.label}
          getOptionValue={(item) => item.value}
        />

        <FormScrollableSelectField
          control={control}
          name="assignee"
          label="ارجاع به کارشناس"
          options={assignees}
          getOptionLabel={(item) => `${item.name} (${item.department})`}
          getOptionValue={(item) => item.id}
        />

        <button
          type="button"
          onClick={handleAssign}
          className="w-full py-2.5 rounded-lg border border-primary text-primary font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/5 transition"
        >
          <UserPlus size={18} />
          ارجاع تیکت
        </button>

        <button
          type="button"
          onClick={handleClose}
          disabled={closeMutation.isPending}
          className="w-full py-2.5 rounded-lg bg-gray-100 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {closeMutation.isPending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Lock size={18} />
          )}
          بستن تیکت
        </button>
      </div>
    </div>
  );
}