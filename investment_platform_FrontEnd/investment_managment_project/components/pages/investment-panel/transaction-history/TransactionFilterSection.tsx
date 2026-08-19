"use client";
import { FormInputField } from "@/components/ui/FormInputField";
import { FormScrollableSelectField } from "@/components/ui/FormScrollableSelectField";
import { RotateCcw } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

type TransactionFilterSectionType = {
  transactionType: string;
  date: string;
  status: string;
};

export default function TransactionFilterSection() {
  const { control, handleSubmit, reset } =
    useForm<TransactionFilterSectionType>();

  const onSubmit: SubmitHandler<TransactionFilterSectionType> = (data) =>
    console.log(data);

  return (
    <section className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 my-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end"
      >
        <FormScrollableSelectField
          control={control}
          name="transactionType"
          options={[
            { Label: "همه موارد", value: "1" },
            { Label: "واریز وجه", value: "2" },
            { Label: "برداشت وجه", value: "3" },
            { Label: "سرمایه‌گذاری", value: "4" },
          ]}
          label="نوع تراکنش"
          getOptionLabel={(otp) => otp.Label}
          getOptionValue={(otp) => otp.value}
        />
        <FormInputField
          control={control}
          name="date"
          label="بازه زمانی"
          placeholder="۱۴۰۲/۰۱/۰۱ - ۱۴۰۲/۱۲/۲۹"
        />
        <FormScrollableSelectField
          options={[{ label: "درحال پردازش", value: "progress" }]}
          control={control}
          name="status"
          getOptionLabel={(otp) => otp.label}
          getOptionValue={(opt) => opt.value}
          label="وضعیت"
        />
        <div className="flex gap-3 h-12">
          <button
            type="submit"
            className="flex-1 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-all shadow-md shadow-primary/10 active:scale-95"
          >
            اعمال فیلتر
          </button>
          <button
            onClick={() => reset()}
            type="submit"
            className="w-12 flex items-center justify-center rounded-xl border-2 border-gray-50 text-text-sub hover:bg-white hover:border-primary hover:text-primary transition-all cursor-pointer"
            title="بازنشانی"
          >
            <RotateCcw />
          </button>
        </div>
      </form>
    </section>
  );
}
