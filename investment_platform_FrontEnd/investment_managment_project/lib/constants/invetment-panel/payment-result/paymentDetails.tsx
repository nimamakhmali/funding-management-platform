import {Calendar, Banknote, CreditCard} from "lucide-react";
import { DetailItemType, PaymentAmount } from "@/lib/types/investment-panel/payment-result/payment-result-type";

export const paymentAmount: PaymentAmount = {
  value: 50000000,
  currency: "ریال",
};
export const paymentDetails: readonly DetailItemType[] = [

  {
    id: "tracking",
    label: "کد رهگیری",
    value: "TRX-982140",
  },


  {
    id: "date",
    label: "زمان پرداخت",
    value: "1404/03/28 - 12:30",
    icon: (
      <Calendar
        size={16}
      />
    ),
  },


  {
    id: "bank",
    label: "درگاه پرداخت",
    value: "بانک ملت",
    icon: (
      <Banknote
        size={16}
      />
    ),
  },


  {
    id: "card",
    label: "شماره کارت",
    value: "6104 **** **** 1234",
    icon: (
      <CreditCard
        size={16}
      />
    ),
  },

];