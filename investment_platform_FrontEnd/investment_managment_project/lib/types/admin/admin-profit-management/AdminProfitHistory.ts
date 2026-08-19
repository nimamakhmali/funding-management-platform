import { ReactNode } from "react";

export interface AdminProfitHistoryItem {
  id: number;
  title: string;
  description: string;
  active?: boolean;
}

export interface AdminProfitSupervisor {
  id: number;
  name: string;
}

export interface ProfitSecurityCard {
  badge: string;
  icon: ReactNode;
  title: string;
  description: string;
  supervisors: AdminProfitSupervisor[];
  footer: string;
}