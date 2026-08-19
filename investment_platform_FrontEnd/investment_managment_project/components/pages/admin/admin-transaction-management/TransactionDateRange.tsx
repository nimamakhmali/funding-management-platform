"use client";

import { Control } from "react-hook-form";

import FormDatePickerField from "@/components/ui/FormDatePickerField";

import { AdminTransactionFilterFormValues } from "@/lib/types/admin/admin-transaction-management/AdminTransactionFilterFormValues-types";

interface Props {
  control: Control<AdminTransactionFilterFormValues>;
}

export default function TransactionDateRange({
  control,
}: Props) {
  return (
    <FormDatePickerField
      control={control}
      name="dateRange"
      label="بازه زمانی"
    />
  );
}