"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Paperclip, Send } from "lucide-react";
import { FormInputField } from "@/components/ui/FormInputField";
import {
  replySchema,
  type ReplyValues,
} from "@/lib/validation/investment-panel/ticket-management/replySchema";

export default function TicketReplyBox({
  onSend,
  isSending = false,
}: {
  onSend: (message: string) => void;
  isSending?: boolean;
}) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileKey, setFileKey] = useState(0);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ReplyValues>({
    resolver: zodResolver(replySchema),
    defaultValues: { message: "" },
  });

  const onSubmit: SubmitHandler<ReplyValues> = (data) => {
    onSend(data.message);
    reset();
    setFileName(null);
    setFileKey((key) => key + 1);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="z-10 border-t border-border bg-surface p-4 md:p-6"
      aria-label="فرم ارسال پاسخ"
    >
      <div className="relative">
        <FormInputField<ReplyValues>
          name="message"
          control={control}
          textarea
          aria-label="متن پاسخ خود را بنویسید"
          placeholder="پاسخ خود را بنویسید..."
          className="min-h-[100px] resize-none bg-[#f8f7fa] pl-12"
        />

        <button
          type="button"
          onClick={() => document.getElementById("ticket-attachment")?.click()}
          className="absolute bottom-3 left-3 rounded-full p-2 text-text-secondary transition-colors hover:bg-gray-200/50 hover:text-primary"
          title="افزودن فایل"
          aria-label="افزودن پیوست"
        >
          <Paperclip size={20} />
        </button>

        <input
          id="ticket-attachment"
          key={fileKey}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          className="hidden"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
      </div>

      {fileName && (
        <p className="mt-2 text-xs text-text-secondary">
          پیوست انتخاب شده: {fileName}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-text-secondary">
          کلید <kbd className="rounded bg-gray-100 px-1 font-mono">Enter</kbd> برای ارسال
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark active:scale-95 disabled:opacity-60"
        >
          <span>ارسال پیام</span>
          <Send size={18} />
        </button>
      </div>
    </form>
  );
}
