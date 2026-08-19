"use client";

import { Edit } from "lucide-react";
import { AdminUserManagement } from "@/lib/types/admin/admin-user-management/AdminUserManagement";

interface Props {
  user: AdminUserManagement;
}

export default function AdminUserActions({ user }: Props) {
  const handleView = () => {
    console.log("View User", user);
  };

  const handleEdit = () => {
    console.log("Edit User", user);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleView}
        className="text-primary hover:underline text-xs font-black"
      >
        مشاهده
      </button>

      <button
        onClick={handleEdit}
        className="text-gray-400 hover:text-primary transition-colors"
      >
        <Edit size={18} />
      </button>
    </div>
  );
}