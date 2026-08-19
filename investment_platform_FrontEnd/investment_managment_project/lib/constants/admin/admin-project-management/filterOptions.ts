import { SelectOption } from "@/lib/types/admin/admin-poject-management/AdminProjectManagementFilter";

export const projectStatuses: SelectOption[] = [
  {
    id: "all",
    title: "همه وضعیت‌ها",
  },
  {
    id: "pending",
    title: "در حال بررسی",
  },
  {
    id: "approved",
    title: "تأیید شده",
  },
  {
    id: "rejected",
    title: "رد شده",
  },
];

export const projectOwners: SelectOption[] = [
  {
    id: "all",
    title: "همه مالکان",
  },
  {
    id: "برج مسکونی آفتاب",
    title: "برج مسکونی آفتاب",
  },
  {
    id: "هلدینگ خلیج فارس",
    title: "هلدینگ خلیج فارس",
  },
  {
    id: "گروه نوآوران",
    title: "گروه نوآوران",
  },
  {
    id: "تعاونی کشاورزی",
    title: "تعاونی کشاورزی",
  },
];