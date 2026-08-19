import { ArrowLeft, Shield } from "lucide-react";

interface CompleteInformationFooterProps {
  formId: string;
  isSubmitting: boolean;
}

export default function CompleteInformationFooter({
  formId,
  isSubmitting,
}: CompleteInformationFooterProps) {
  return (
    <footer className="bg-[#fcfbfc] p-6 border-t border-[#f1f0f5] flex flex-col items-center gap-4 mt-10">
      <button
        type="submit"
        form={formId}
        disabled={isSubmitting}
        className="w-full max-w-sm h-12 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <span>{isSubmitting ? "در حال ذخیره..." : "ذخیره و ادامه"}</span>
        <ArrowLeft size={20} />
      </button>
      <div className="flex items-center gap-1.5 text-xs text-text-secondary opacity-80">
        <Shield size={18} />
        <p>اطلاعات شما به‌صورت امن ذخیره می‌شود.</p>
      </div>
    </footer>
  );
}
