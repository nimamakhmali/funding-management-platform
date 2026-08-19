"use client";

import { Control } from "react-hook-form";
import { FormInputField } from "@/components/ui/FormInputField";
import { AdminTransactionFilterFormValues } from "@/lib/types/admin/admin-transaction-management/AdminTransactionFilterFormValues-types";

interface Props {
  control: Control<AdminTransactionFilterFormValues>;
}

export default function TransactionPriceRange({
  control,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:col-span-2">
      <FormInputField
        control={control}
        name="minPrice"
        label="حداقل مبلغ"
        type="number"
        placeholder="حداقل مبلغ"
      />

      <FormInputField
        control={control}
        name="maxPrice"
        label="حداکثر مبلغ"
        type="number"
        placeholder="حداکثر مبلغ"
      />
    </div>
  );
}