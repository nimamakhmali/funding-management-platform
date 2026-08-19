"use client";

import { cn } from "@/lib/utils";
import { UserRole } from "@/lib/types/admin/admin-user-management/AdminUserManagement";

type Props = {
  role: UserRole;
};

const roleStyles: Record<UserRole, string> = {
  "مدیر سیستم":
    "bg-violet-50 text-violet-700 border border-violet-200",

  "سرمایه‌گذار":
    "bg-primary/10 text-primary border border-primary/20",

  "کارشناس مالی":
    "bg-gray-100 text-gray-600 border border-gray-200",
};

export default function UserRoleBadge({ role }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold",
        roleStyles[role]
      )}
    >
      {role}
    </span>
  );
}