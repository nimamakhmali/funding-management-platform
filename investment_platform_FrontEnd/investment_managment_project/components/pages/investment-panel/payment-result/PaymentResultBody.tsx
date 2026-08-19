import { paymentAmount, paymentDetails } from "@/lib/constants/invetment-panel/payment-result/paymentDetails";

export function PaymentResultBody() {
  return (
    <main className="p-5">
      <div className="rounded-lg border border-dashed border-primary/20 bg-primary-50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            مبلغ پرداخت شده
          </span>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-bold">
              {paymentAmount.value.toLocaleString("fa-IR")}
            </span>
            <span className="mb-1 text-xs">
              {paymentAmount.currency}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {
          paymentDetails.map((item)=>(
            <div key={item.id} className="flex flex-col gap-1">
              <span className="text-xs text-text-gray-500">
                {item.label}
              </span>
              <div className="flex items-center gap-2">
                {item.icon}
                <span className="text-sm font-medium text-text-main">
                  {item.value}
                </span>
              </div>
            </div>
          ))
        }
      </div>
    </main>
  );
}