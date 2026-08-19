export type ProjectFilters = {
  search: string;
  industry: string;
  status: string;

  minCapital: number | null;
  maxCapital: number | null;

  profitPercent: number | null;
};