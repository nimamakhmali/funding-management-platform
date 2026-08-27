"use client";

import { ReusableTable, Column } from "@/components/ui/ReusableTable";
import { AdminUser } from "@/lib/api/services/admin.service";
import {
  AdminUserManagement,
  UserRole,
} from "@/lib/types/admin/admin-user-management/AdminUserManagement";
import UserRoleBadge from "./UserRoleBadge";
import AdminUserStatus from "./AdminUserStatus";
import AdminUserAvatar from "./AdminUserAvatar";
import AdminUserInfo from "./AdminUserInfo";
import AdminUserActions from "./AdminUserActions";

interface Props {
  data: AdminUser[];
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

// نگه داشتن UUID اصلی در کنار mapped data
interface MappedUser {
  mapped: AdminUserManagement;
  originalId: string;
}

function mapRole(role: string): UserRole {
  const roleMap: Record<string, UserRole> = {
    ADMIN: "مدیر سیستم",
    INVESTOR: "سرمایه‌گذار",
    ENTREPRENEUR: "کارشناس مالی",
    admin: "مدیر سیستم",
    investor: "سرمایه‌گذار",
    entrepreneur: "کارشناس مالی",
  };
  return roleMap[role] ?? "سرمایه‌گذار";
}

function mapUser(u: AdminUser, index: number): MappedUser {
  const fullName =
    u.profile?.first_name && u.profile?.last_name
      ? `${u.profile.first_name} ${u.profile.last_name}`
      : u.phone_number;

  return {
    originalId: u.id,
    mapped: {
      id: index + 1,
      name: fullName,
      email: u.profile?.email ?? u.phone_number,
      role: mapRole(u.role),
      active: u.is_active,
      joined: u.created_at
        ? new Date(u.created_at).toLocaleDateString("fa-IR")
        : "—",
    },
  };
}

export default function AdminUserTable({
  data,
  isLoading,
  totalPages,
  currentPage,
  onPageChange,
}: Props) {
  const mappedUsers = data.map(mapUser);

  const tableColumns: Column<MappedUser>[] = [
    {
      header: "نام کاربر",
      accessor: (item) => <AdminUserAvatar name={item.mapped.name} />,
    },
    {
      header: "ایمیل / شناسه",
      accessor: (item) => (
        <AdminUserInfo email={item.mapped.email} id={item.mapped.id} />
      ),
    },
    {
      header: "نقش",
      accessor: (item) => <UserRoleBadge role={item.mapped.role} />,
    },
    {
      header: "وضعیت",
      accessor: (item) => <AdminUserStatus active={item.mapped.active} />,
    },
    {
      header: "تاریخ عضویت",
      accessor: (item) => item.mapped.joined,
    },
    {
      header: "عملیات",
      accessor: (item) => (
        <AdminUserActions
          user={item.mapped}
          userId={item.originalId}
        />
      ),
    },
  ];

  return (
    <ReusableTable
      data={mappedUsers}
      columns={tableColumns}
      enablePagination
      itemsPerPage={10}
      isLoading={isLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}