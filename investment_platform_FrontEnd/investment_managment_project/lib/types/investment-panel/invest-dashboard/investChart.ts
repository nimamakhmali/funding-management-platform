export type ChartPeriod =
  | "week"
  | "month"
  | "year";


export interface PortfolioChartPoint {
  month: string;
  value: number;
}