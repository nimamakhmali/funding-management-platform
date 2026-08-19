import { MyProjectsFilterForm } from "@/lib/types/project-owner-panel/my-project/MyProjectsFilterForm";

export type SelectOption = {
  label: string;
  value: string;
};

export const PROJECT_STATUS_OPTIONS: SelectOption[] = [
  {
    label: "همه وضعیت‌ها",
    value: "all",
  },
  {
    label: "در حال جذب سرمایه",
    value: "funding",
  },
  {
    label: "تکمیل شده",
    value: "completed",
  },
];

export const PROJECT_CATEGORY_OPTIONS: SelectOption[] = [
  {
    label: "همه دسته‌بندی‌ها",
    value: "all",
  },
  {
    label: "مسکن",
    value: "housing",
  },
  {
    label: "تجاری",
    value: "commercial",
  },
  {
    label: "کشاورزی",
    value: "agriculture",
  },
];