"use client";

import { Control } from "react-hook-form";
import { FormScrollableSelectField } from "@/components/ui/FormScrollableSelectField";
import { AdminTransactionFilterFormValues } from "@/lib/types/admin/admin-transaction-management/AdminTransactionFilterFormValues-types";
import { transactionTypes } from "@/lib/constants/admin/admin-transaction-management/AdminTransactionFilterFormValue";
type Props = {
  control: Control<AdminTransactionFilterFormValues>;
};

export default function TransactionTypeSelect({
  control,
}: Props) {
  return (
    <FormScrollableSelectField
      control={control}
      name="transaction"
      label="وضعیت"
      options={transactionTypes }
      getOptionLabel={(item) => item.title}
      getOptionValue={(item) => item.id}
    />
  );
}