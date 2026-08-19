export type ProgressChartItem = {
  month: string;
  progress: number;
};

export type ProjectProgressCardProps = {
  title: string;
  description?: string;
  data: ProgressChartItem[];
  className?: string;
};