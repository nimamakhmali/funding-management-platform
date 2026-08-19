// types.ts

export type UserRole =
  | "مدیر سیستم"
  | "سرمایه‌گذار"
  | "کارشناس مالی";

export type AdminUserManagement = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  joined: string;
}