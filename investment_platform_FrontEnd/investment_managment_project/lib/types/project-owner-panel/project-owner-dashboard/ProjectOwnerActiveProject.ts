export type ProjectOwnerProjectStat = {
  label: string;
  value: string;
  unit?: string;
  valueClassName?: string;
};

export type ProjectOwnerActiveProject = {
  title: string;
  code: string;
  targetPercent: number;
  progress: number;
  icon: React.ReactNode;
  status: string;
  stats: ProjectOwnerProjectStat[];
};