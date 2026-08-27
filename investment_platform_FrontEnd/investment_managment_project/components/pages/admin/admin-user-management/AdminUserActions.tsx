"use client";

import { Edit, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { AdminUserManagement } from "@/lib/types/admin/admin-user-management/AdminUserManagement";

interface Props {
  user: AdminUserManagement;
  // id اصلی UUID از backend برای routing
  userId?: string;
}

export default function AdminUserActions({ user, userId }: Props) {
  const router = useRouter();

  const handleView = () => {
    // نمایش modal یا navigate به صفحه جزئیات
    // فعلاً alert با اطلاعات — بعداً modal اضافه می‌شود
    alert(
      `اطلاعات کاربر:\nنام: ${user.name}\nایمیل: ${user.email}\nنقش: ${user.role}\nوضعیت: ${user.active ? "فعال" : "غیرفعال"}`
    );
  };

  const handleEdit = () => {
    alert(`ویرایش کاربر: ${user.name}\n(این قابلیت در فاز بعدی پیاده‌سازی می‌شود)`);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleView}
        title="مشاهده جزئیات"
        className="text-primary hover:underline text-xs font-black flex items-center gap-1"
      >
        <Eye size={14} />
        مشاهده
      </button>

      <button
        onClick={handleEdit}
        title="ویرایش کاربر"
        className="text-gray-400 hover:text-primary transition-colors"
      >
        <Edit size={18} />
      </button>
    </div>
  );
}