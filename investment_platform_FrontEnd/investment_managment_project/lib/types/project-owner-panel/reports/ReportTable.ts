
export interface Report {
  id: number;
  projectName: string;
  startDate: string;
  targetAmount: string;
  raisedAmount: string;
  progress: number;
  status: "فعال" | "تکمیل شده" | "اولیه";
}

// نوع جدید از API
export interface ApiReportRow {
  id: string;
  project_name: string;
  start_date: string;
  target_amount: string;
  raised_amount: string;
  progress: number;
  status: string;
  status_code: string;
  investors_count: number;
  profit_rate: string;
}