"use client";
import { FormScrollableSelectField } from "@/components/ui/FormScrollableSelectField";
import { SubmitHandler, useForm } from "react-hook-form";

type SubmitData = {
  date: string;
  project: string;
};

const dateOptions = [
  { label: "ماهانه", value: "monthly" },
  { label: "فصلی", value: "quarterly" },
  { label: "سالانه", value: "yearly" },
];

export default function ProfitReportFilter() {
  const { control, handleSubmit, reset, setValue, watch } = useForm<SubmitData>(
    {
      defaultValues: {
        date: "quarterly",
        project: "",
      },
    },
  );

  const selectedDate = watch("date");

  const onSubmit: SubmitHandler<SubmitData> = (data) => console.log(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm"
    >
      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_auto] gap-3 lg:gap-4 items-center">
        <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100 w-full sm:w-auto">
          {dateOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setValue("date", option.value)}
              className={`flex-1 px-3 sm:px-6 py-2.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedDate === option.value
                  ? "bg-white text-primary font-black shadow-sm ring-1 ring-gray-200/50"
                  : "text-text-sub hover:text-primary"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="w-full lg:max-w-75">
          <FormScrollableSelectField
            selectStyle="w-full"
            control={control}
            name="project"
            options={[
              { label: "همه پروژه‌ها", value: "all" },
              { label: "صندوق سرمایه‌گذاری آلفا", value: "all2" },
              { label: "پروژه ساختمانی ونک", value: "all3" },
              { label: "سهام تکنولوژی بتا", value: "all4" },
            ]}
            getOptionLabel={(otp) => otp.label}
            getOptionValue={(otp) => otp.value}
            placeholder="همه پروژه ها"
          />
        </div>
        <div className="flex gap-2 sm:gap-3 sm:col-span-2 lg:col-span-1 justify-end">
          <button
            type="submit"
            className="flex-1 sm:flex-none px-6 sm:px-10 py-3 bg-primary hover:bg-primary-dark text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
          >
            اعمال فیلتر
          </button>
          <button
            type="button"
            onClick={() => reset({ date: "quarterly", project: "" })}
            className="flex-1 border border-gray-400 sm:flex-none px-4 sm:px-6 py-3 text-text-sub text-sm font-bold hover:bg-gray-50 rounded-xl transition-colors whitespace-nowrap"
          >
            پاکسازی
          </button>
        </div>
      </div>
    </form>
  );
}
