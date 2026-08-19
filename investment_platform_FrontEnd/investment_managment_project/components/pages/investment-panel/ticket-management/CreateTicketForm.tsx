"use client";

import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, ShieldCheck } from "lucide-react";

import { FormInputField } from "@/components/ui/FormInputField";
import FormFileUploadField from "@/components/ui/FormFileUploadField";
import {
  createTicketSchema,
  type CreateTicketValues,
} from "@/lib/validation/investment-panel/ticket-management/createTicketSchema";
import { useCreateTicket } from "@/lib/hooks/useTickets";

// ── نگاشت اولویت فرانت → بک‌اند ─────────────────────────────────────────────
const PRIORITY_MAP: Record<string, "LOW" | "MEDIUM" | "HIGH"> = {
  low: "LOW",
  medium: "MEDIUM",
  high: "HIGH",
};

export default function CreateTicketForm() {
  const router = useRouter();
  const createTicketMutation = useCreateTicket();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateTicketValues>({
    resolver: zodResolver(createTicketSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      message: "",
      attachment: [],
    },
  });

  const onSubmit: SubmitHandler<CreateTicketValues> = async (data) => {
    createTicketMutation.mutate(
      {
        subject: data.title,
        priority: PRIORITY_MAP[data.priority ?? "medium"] ?? "MEDIUM",
        message: data.message,
      },
      {
        onSuccess: (ticket) => {
          reset();
          // redirect به صفحه جزئیات تیکت
          router.push(`/invest-support/${ticket.id}`);
        },
      }
    );
  };

  const isPending =
    createTicketMutation.isPending || isSubmitting;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-surface rounded-2xl border border-border shadow-xl shadow-gray-200/50 overflow-hidden"
      noValidate
      aria-label="فرم ایجاد تیکت جدید"
    >
      <div className="p-6 sm:p-8 space-y-8">
        <div className="space-y-2">
          <FormInputField<CreateTicketValues>
            name="title"
            control={control}
            label="عنوان تیکت"
            placeholder="موضوع تیکت خود را کوتاه و گویا بنویسید..."
            rules={{ required: true }}
          />
          <p className="text-[11px] text-text-light pr-1">
            مثال: مشکل در تایید مدارک هویتی یا واریز وجه
          </p>
        </div>

        <div className="space-y-2">
          <FormInputField<CreateTicketValues>
            name="message"
            control={control}
            label="متن پیام"
            textarea
            placeholder="شرح کامل درخواست، سوال یا مشکل خود را اینجا بنویسید..."
            rules={{ required: true }}
          />
        </div>

        <FormFileUploadField<CreateTicketValues>
          name="attachment"
          control={control}
          label="پیوست فایل"
          accept=".jpg,.jpeg,.png,.pdf"
          multiple
          maxSize={5}
        />
      </div>

      {/* خطای کلی */}
      {createTicketMutation.isError && (
        <div className="px-6 sm:px-8 pb-2 text-sm text-red-500">
          خطا در ثبت تیکت. لطفاً دوباره تلاش کنید.
        </div>
      )}

      <div className="px-6 sm:px-8 py-6 bg-gray-50/50 border-t border-border flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="px-8 py-3 text-sm font-bold text-text-muted hover:text-gray-700 transition-colors"
        >
          انصراف
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-10 py-3.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <span>
            {isPending ? "در حال ارسال..." : "ارسال تیکت"}
          </span>
          <Send size={18} />
        </button>
      </div>

      <div className="px-6 sm:px-8 pb-6 flex items-center gap-3 justify-center text-text-light">
        <ShieldCheck size={18} />
        <span className="text-xs">
          تیکت‌های شما در پروتکل‌های امنیتی چندلایه رمزنگاری می‌شوند.
        </span>
      </div>
    </form>
  );
}