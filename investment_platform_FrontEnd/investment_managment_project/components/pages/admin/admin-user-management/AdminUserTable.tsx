"use client"
import { ReusableTable, Column } from "@/components/ui/ReusableTable";
import { AdminUserManagement } from "@/lib/types/admin/admin-user-management/AdminUserManagement";
import { usersTable } from "@/lib/constants/admin/admin-user-managment/AdminUserManagment";
import UserRoleBadge from "./UserRoleBadge";
import AdminUserStatus from "./AdminUserStatus";
import AdminUserAvatar from "./AdminUserAvatar";
import AdminUserInfo from "./AdminUserInfo";
import AdminUserActions from "./AdminUserActions";


export default function AdminUserTable() {
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
}
  ];

  return (
    <ReusableTable
      data={usersTable}
      columns={tableColumns}
      enablePagination
      itemsPerPage={2}
    />
  );
}