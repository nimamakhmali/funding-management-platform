"use client";

import { CalendarMinus2Icon } from "lucide-react";
import { Control } from "react-hook-form";

import FormDatePickerField from "@/components/ui/FormDatePickerField";
import { FormInputField } from "@/components/ui/FormInputField";

import { CreateProjectFormValues } from "@/lib/validation/create-project.validation";

type Props = {
  control: Control<CreateProjectFormValues>;
};

export default function ProjectScheduleSection({
  control,
}: Props) {
  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <CalendarMinus2Icon className="h-5 w-5 text-primary" />

        <h3 className="text-lg font-bold text-text-main dark:text-white">
          زمان‌بندی پروژه
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormDatePickerField
          control={control}
          name="startDate"
          label="تاریخ شروع"
        />

        <FormDatePickerField
          control={control}
          name="endDate"
          label="تاریخ پایان"
        />

        <FormInputField
          control={control}
          name="duration"
          label="مدت تامین مالی (ماه)"
          type="number"
        
        />
      </div>
    </div>
  );
}