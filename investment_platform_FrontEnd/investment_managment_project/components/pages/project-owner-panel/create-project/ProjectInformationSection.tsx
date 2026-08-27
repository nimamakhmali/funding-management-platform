"use client";

import { Info, ImagePlus, X } from "lucide-react";
import { Control, useController } from "react-hook-form";
import { useRef, useState } from "react";

import { FormInputField } from "@/components/ui/FormInputField";
import { FormScrollableSelectField } from "@/components/ui/FormScrollableSelectField";
import { CreateProjectFormValues } from "@/lib/validation/create-project.validation";
import { projectCategories } from "@/lib/constants/project-owner-panel/create-project/create-new-project";

type Props = {
  control: Control<CreateProjectFormValues>;
};

export default function ProjectInformationSection({ control }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    field,
    fieldState: { error },
  } = useController({ control, name: "coverImage" });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // نمایش preview
    const url = URL.createObjectURL(file);
    setPreview(url);
    field.onChange(file);
  };

  const handleRemove = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    field.onChange(null);
    // reset input
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Info className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-text-main dark:text-white">
          اطلاعات پروژه
        </h3>
      </div>

      {/* ── آپلود تصویر Cover ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-text-main dark:text-white">
          تصویر پروژه
          <span className="text-gray-400 font-normal mr-1">(اختیاری)</span>
        </label>

        {preview ? (
          /* نمایش preview */
          <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 dark:border-[#3d384e]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="تصویر پروژه"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              title="حذف تصویر"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          /* ناحیه آپلود */
          <label
            className={`
              flex flex-col items-center justify-center gap-3 
              w-full h-48 rounded-xl border-2 border-dashed cursor-pointer
              transition-all hover:border-primary hover:bg-primary/5
              ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 dark:border-[#3d384e] dark:bg-white/5"}
            `}
          >
            <ImagePlus className="h-8 w-8 text-gray-400" />
            <div className="text-center">
              <p className="text-sm font-medium text-text-main dark:text-white">
                تصویر cover پروژه را انتخاب کنید
              </p>
              <p className="text-xs text-gray-400 mt-1">
                JPG، PNG یا WEBP — حداکثر ۵MB
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        )}

        {error && (
          <p className="text-xs text-red-500 font-medium">{error.message}</p>
        )}
      </div>

      {/* ── فیلدهای متنی ───────────────────────────────────────────────────── */}
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