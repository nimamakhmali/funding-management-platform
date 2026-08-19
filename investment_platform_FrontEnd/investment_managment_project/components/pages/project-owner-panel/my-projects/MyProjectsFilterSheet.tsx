"use client";

import { useForm } from "react-hook-form";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { FormInputField } from "@/components/ui/FormInputField";
import { FormScrollableSelectField } from "@/components/ui/FormScrollableSelectField";

import { MyProjectsFilterForm } from 
"@/lib/types/project-owner-panel/my-project/MyProjectsFilterForm";

import { PROJECT_CATEGORY_OPTIONS, PROJECT_STATUS_OPTIONS } from 
"@/lib/constants/project-owner-panel/my-project/MyProjectsFilterDefaultValues";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function MyProjectsFilterSheet({
  open,
  onOpenChange,
}: Props) {
  const {
  control,
  handleSubmit,
  reset,
} = useForm<MyProjectsFilterForm>({
  defaultValues: {
    search: "",
    category: "all",
    status: "all",
  },
});

  const onSubmit = (data: MyProjectsFilterForm) => {
    console.log(data);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col p-0 sm:max-w-md bg-white border-gray-100"
      >
        <SheetHeader className="border-b border-b-gray-100 px-6 py-5">
          <SheetTitle className="text-right text-xl font-bold">
            فیلتر پروژه‌ها
          </SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col"
        >
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

            <FormInputField
              control={control}
              name="search"
              label="جستجوی پروژه"
              placeholder="نام پروژه را وارد کنید..."
            />

            <FormScrollableSelectField
              control={control}
              name="status"
              label="وضعیت پروژه"
              options={PROJECT_STATUS_OPTIONS}
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.value}
            />

            <FormScrollableSelectField
              control={control}
              name="category"
              label="دسته‌بندی"
              options={PROJECT_CATEGORY_OPTIONS}
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.value}
            />

          </div>

         <div className="border-t border-t-gray-100 px-6 py-5">
  <div className="flex gap-3">
    <button
      type="button"
      onClick={() =>
        reset({
          search: "",
          category: "all",
          status: "all",
        })
      }
      className="flex-1 rounded-xl border border-border bg-white py-3 text-sm font-bold text-text-main transition hover:bg-gray-50"
    >
      حذف فیلترها
    </button>

    <button
      type="submit"
      className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-white transition hover:bg-primary-hover"
    >
      اعمال فیلتر
    </button>
  </div>
</div>
        </form>
      </SheetContent>
    </Sheet>
  );
}