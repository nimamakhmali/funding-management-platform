import { ArrowLeft, Printer} from "lucide-react";
export function PaymentResultFooter() {
  return (
    <footer className="flex gap-3 border-t border-t-gray-100 bg-gray-50 p-4">
      <button className="flex-1 rounded-lg bg-primary px-4 py-3 text-white">
        <span className="flex justify-center gap-2"> بازگشت به داشبورد
          <ArrowLeft size={18}/>
        </span>
      </button>
      <button className="flex-1 rounded-lg border border-gray-200 px-4 py-3">
        <span className="flex justify-center gap-2">
          <Printer size={18}/>
          چاپ رسید
        </span>
      </button>

    </footer>
    
  );
}