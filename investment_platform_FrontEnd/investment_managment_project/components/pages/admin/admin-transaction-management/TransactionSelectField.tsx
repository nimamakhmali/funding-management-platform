"use client";

import { Control } from "react-hook-form";
import { FormScrollableSelectField } from "@/components/ui/FormScrollableSelectField";
import { AdminTransactionFilterFormValues } from "@/lib/types/admin/admin-transaction-management/AdminTransactionFilterFormValues-types";
import { transaction } from "@/lib/constants/admin/admin-transaction-management/AdminTransactionFilterFormValue";

type Props = {
  control: Control<AdminTransactionFilterFormValues>;
};

export default function TransactionSelect({
  control,
}: Props) {
  return (
    <FormScrollableSelectField
  control={control}
  name="transactionType"
  label="وضعیت"
  options={transaction}
  getOptionLabel={(item) => item.title}
  getOptionValue={(item) => item.id}
/>
  );
}