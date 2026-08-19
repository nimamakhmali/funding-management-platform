import { ReactNode } from "react";

export interface DetailItemType {
  id: string;
  label: string;
  value: string;
  icon?: ReactNode;
}
export interface PaymentAmount {
  value: number;
  currency: string;
}
export interface PaymentHeaderProps {
  title?: string;
  description?: string;
}
export interface PaymentBodyProps<
  T extends DetailItemType
> {
  amount: PaymentAmount;

  details: readonly T[];

  renderValue?: (item: T) => ReactNode;
}
export interface PaymentFooterProps {
  onBack?: VoidFunction;

  onPrint?: VoidFunction;
}