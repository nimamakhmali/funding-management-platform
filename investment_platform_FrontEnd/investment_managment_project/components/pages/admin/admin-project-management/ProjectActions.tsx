"use client";

import { CheckCircle, View, XCircle, Loader2 } from "lucide-react";
import { AdminProjectManagementRow } from "@/lib/types/admin/admin-poject-management/AdminProjectTable";
import { useAdminChangeProjectStatus } from "@/lib/hooks/useAdmin";
import { useRouter } from "next/navigation";

type Props = {
  project: AdminProjectManagementRow;
};

// mapping وضعیت فرانت → backend
const STATUS_TO_BACKEND: Record<string, string> = {
  pending: "PENDING_REVIEW",
  approved: "APPROVED",
  rejected: "REJECTED",
};

export default function AdminProjectManagementActions({ project }: Props) {
  const router = useRouter();
  const changeMutation = useAdminChangeProjectStatus();

  const isPending =
    project.status === "pending" && !changeMutation.isPending;

  const handleView = () => {
    // navigate به صفحه جزئیات پروژه عمومی
    router.push(`/projects/${project.id}`);
  };

  const handleApprove = async () => {
    if (!isPending) return;
    try {
      await changeMutation.mutateAsync({
        id: project.id,
        to_status: "APPROVED",
      });
    } catch {
      // React Query خطا را مدیریت می‌کند
    }
  };

  const handleReject = async () => {
    if (!isPending) return;
    try {
      await changeMutation.mutateAsync({
        id: project.id,
        to_status: "REJECTED",
        reason: "رد شده توسط مدیر",
      });
    } catch {
      // React Query خطا را مدیریت می‌کند
    }
  };

  if (changeMutation.isPending) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 size={18} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-1.5">
      {/* مشاهده جزئیات */}
      <button
        onClick={handleView}
        title="مشاهده جزئیات"
        className="text-text-muted hover:text-primary p-2 rounded-xl hover:bg-primary/10 transition-all"
      >
        <View size={18} />
      </button>

      <div className="h-4 w-px bg-border-subtle" />

      {/* تأیید */}
      <button
        onClick={handleApprove}
        disabled={!isPending}
        title={isPending ? "تأیید پروژه" : "قابل تغییر نیست"}
        className={
          isPending
            ? "text-text-muted hover:text-green-600 p-2 rounded-xl hover:bg-green-50 transition-all"
            : "text-gray-300 p-2 cursor-not-allowed"
        }
      >
        <CheckCircle size={18} />
      </button>

      {/* رد */}
      <button
        onClick={handleReject}
        disabled={!isPending}
        title={isPending ? "رد پروژه" : "قابل تغییر نیست"}
        className={
          isPending
            ? "text-text-muted hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-all"
            : "text-gray-300 p-2 cursor-not-allowed"
        }
      >
        <XCircle size={18} />
      </button>
    </div>
  );
}