export type AdminTransactionFilterFormValues = {
  transaction: string;
  dateRange: string;
  minPrice?: number;
  maxPrice?: number;
  transactionType: string;
};