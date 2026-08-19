export type ProjectStatus =
  | "active"
  | "funded"
  | "closed";

export type DocumentType =
  | "pdf"
  | "excel"
  | "zip";

export interface ProjectDocument {
  id: string;
  title: string;
  size: string;
  type: DocumentType;
  isLocked: boolean;
}

export type Project = {
  id: string;

  title: string;
  symbol: string;

  description: string;
  shortDescription: string;

  industry: string;
  category: string;

  image: string;

  status: ProjectStatus;

  progress: number;

  targetAmount: number;
  fundedAmount: number;

  investors: number;

  profit: number;

  chartData: number[];

  projectCode: string;

  remainingDays: number;

  minInvestment: number;

  maxInvestment: number;

  investmentPeriod: number;

  paymentPeriod: string;

  guarantee: string;

  documents: ProjectDocument[];
};