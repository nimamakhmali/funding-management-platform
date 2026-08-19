"use client";

import { Info } from "lucide-react";
import { Control } from "react-hook-form";

import { FormInputField } from "@/components/ui/FormInputField";
import { FormScrollableSelectField } from "@/components/ui/FormScrollableSelectField";

import { CreateProjectFormValues } from "@/lib/validation/create-project.validation";
import { projectCategories } from "@/lib/constants/project-owner-panel/create-project/create-new-project";

type Props = {
  control: Control<CreateProjectFormValues>;
};

export default function ProjectInformationSection({
  control,
}: Props) {
  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Info className="h-5 w-5 text-primary" />

        <h3 className="text-lg font-bold text-text-main dark:text-white">
          اطلاعات پروژه
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInputField
          control={control}
          name="projectName"
          label="نام پروژه"
          placeholder="مثال: مجتمع تجاری کوروش"
        />

        <FormScrollableSelectField
          control={control}
          name="category"
          label="دسته بندی پروژه"
          options={projectCategories}
          getOptionLabel={(item) => item.title}
          getOptionValue={(item) => item.id}
        />
      </div>

      <FormInputField
        control={control}
        name="shortDesc"
        label="توضیح کوتاه"
        placeholder="خلاصه‌ای از پروژه"
      />

      <FormInputField
        control={control}
        name="fullDesc"
        label="توضیحات کامل"
        placeholder="توضیحات کامل پروژه"
      />
    </div>
  );
}