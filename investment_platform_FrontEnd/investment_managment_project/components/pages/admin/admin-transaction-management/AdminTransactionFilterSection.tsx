"use client";

import { Filter } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import TransactionSelect from "./TransactionSelectField";
import TransactionDateRange from "./TransactionDateRange";
import TransactionTypeSelect from "./TransactionTypeSelect";
import TransactionFilterButtons from "./TransactionFilterButton";
import { AdminTransactionFilterFormValues } from "@/lib/types/admin/admin-transaction-management/AdminTransactionFilterFormValues-types";
import TransactionPriceRange from "./TransactionPriceRange";

export default function AdminTransactionManagement() {
  const { control, handleSubmit, reset } =
  useForm<AdminTransactionFilterFormValues>({
    defaultValues: {
      transaction: "all",
      dateRange: "",
      minPrice: undefined,
      maxPrice: undefined,
      transactionType: "all",
    },
  });

  const onSubmit: SubmitHandler<AdminTransactionFilterFormValues> = (
    data,
  ) => {
    console.log(data);
  };

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-5 w-5 text-primary" />

        <h3 className="text-lg font-bold text-text-main">
          فیلتر تراکنش ها
        </h3>
      </div>

      <form
  onSubmit={handleSubmit(onSubmit)}
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end"
>
  <TransactionSelect control={control} />

  <TransactionDateRange control={control} />

  <TransactionPriceRange control={control} />

  <TransactionTypeSelect control={control} />

  <TransactionFilterButtons onReset={() => reset()} />
</form>
    </section>
  );
}