export type ProjectStatusItem = {
  id: "completed" | "running" | "waiting";
  title: string;
  value: number;
};

export const projectStatus: ProjectStatusItem[] = [
  {
    id: "completed",
    title: "تکمیل شده",
    value: 60,
  },
  {
    id: "running",
    title: "در حال اجرا",
    value: 30,
  },
  {
    id: "waiting",
    title: "در انتظار",
    value: 10,
  },
];