"use client";

import { Receipt } from "lucide-react";
import { Control } from "react-hook-form";

import { FormInputField } from "@/components/ui/FormInputField";
import { CreateProjectFormValues } from "@/lib/validation/create-project.validation";

type Props = {
  control: Control<CreateProjectFormValues>;
};

export default function ProjectFinanceSection({
  control,
}: Props) {
  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Receipt className="h-5 w-5 text-primary" />

        <h3 className="text-lg font-bold text-text-main dark:text-white">
          مبلغ هدف تامین مالی
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInputField
          control={control}
          name="targetAmount"
          label="مبلغ مورد نیاز"
          type="number"
        />

        <FormInputField
          control={control}
          name="minInvest"
          label="حداقل سرمایه‌گذاری"
          type="number"
        />
      </div>
    </div>
  );
}