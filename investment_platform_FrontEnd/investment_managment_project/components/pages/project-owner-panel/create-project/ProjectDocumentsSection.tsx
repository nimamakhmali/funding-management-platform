"use client";

import { Folder } from "lucide-react";
import { Control } from "react-hook-form";

import FormFileUploadField from "@/components/ui/FormFileUploadField";
import { CreateProjectFormValues } from "@/lib/validation/create-project.validation";

type Props = {
  control: Control<CreateProjectFormValues>;
};

export default function ProjectDocumentsSection({ control }: Props) {
  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Folder className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-text-main dark:text-white">
          بارگذاری مدارک پروژه
        </h3>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        مدارک پروژه را می‌توانید پس از ثبت پروژه نیز بارگذاری کنید.
      </p>

      <FormFileUploadField
        control={control}
        name="documents"
        label="مدارک پروژه (اختیاری)"
        multiple
        maxSize={10}
        accept=".pdf,.jpg,.jpeg,.png"
      />
    </div>
  );
}