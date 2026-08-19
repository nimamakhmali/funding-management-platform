"use client";

import { Control } from "react-hook-form";
import { FormScrollableSelectField } from "@/components/ui/FormScrollableSelectField";
import { TICKET_FILTERS } from "@/lib/constants/admin/admin-ticket-management/TicketFilterFormValues ";
import { AdminTicketManagementForm } from 
"@/lib/types/admin/admin-ticket-management/AdminTicketManagementForm";

type Props = {
  control: Control<AdminTicketManagementForm>;
};
export default function TicketStatusField({
  control,
}: Props) {
  return (
    <FormScrollableSelectField
      control={control}
      name="status"
      label="تغییر وضعیت تیکت"
      options={TICKET_FILTERS.status}
      getOptionLabel={(option) => option.label}
      getOptionValue={(option) => option.value}
      placeholder="انتخاب وضعیت"
    />
  );
}