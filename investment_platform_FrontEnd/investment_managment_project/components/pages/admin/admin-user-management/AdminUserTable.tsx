"use client"
import { ReusableTable, Column } from "@/components/ui/ReusableTable";
import { AdminUser } from "@/lib/api/services/admin.service";
import { AdminUserManagement, UserRole } from "@/lib/types/admin/admin-user-management/AdminUserManagement";
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

function mapRole(role: string): UserRole {
  if (role === "مدیر سیستم" || role === "سرمایه‌گذار" || role === "کارشناس مالی") {
    return role;
  }
  return "سرمایه‌گذار";
}

function mapUser(u: AdminUser, index: number): AdminUserManagement {
  const fullName = u.profile?.first_name && u.profile?.last_name
    ? `${u.profile.first_name} ${u.profile.last_name}`
    : u.phone_number;

  return {
    id: index + 1,
    name: fullName,
    email: u.profile?.email ?? "",
    role: mapRole(u.role),
    active: u.is_active,
    joined: u.created_at,
  };
}

export default function AdminUserTable({
  data,
  isLoading,
  totalPages,
  currentPage,
  onPageChange,
}: Props) {
  const tableColumns: Column<AdminUserManagement>[] = [
    {
      header: "نام کاربر",
      accessor: (user) => (
        <AdminUserAvatar
          name={user.name}
        />
      ),
    },
    {
      header: "ایمیل / شناسه",
      accessor: (user) => (
        <AdminUserInfo
          email={user.email}
          id={user.id}
        />
      ),
    },
    {
      header: "نقش",
      accessor: (user) => (
        <UserRoleBadge role={user.role} />
      ),
    },
    {
      header: "وضعیت",
      accessor: (user) => (
        <AdminUserStatus
          active={user.active}
        />
      ),
    },
    {
      header: "تاریخ عضویت",
      accessor: (user) => user.joined,
    },
    {
      header: "عملیات",
      accessor: (user) => (
        <AdminUserActions user={user} />
      ),
    },
  ];

  const tableData = data.map(mapUser);

  return (
    <ReusableTable
      data={tableData}
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
