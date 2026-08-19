import {
  CheckCircle,
  View,
  XCircle,
} from "lucide-react";


import { AdminProjectManagementRow } from "@/lib/types/admin/admin-poject-management/AdminProjectTable";
type Props = {
  project: AdminProjectManagementRow;
};

export default function AdminProjectManagementActions({ project }: Props) {
  const isPending = project.status === "pending";

  return (
    <div className="flex items-center justify-center gap-1.5">

      <button className="text-text-muted hover:text-primary p-2 rounded-xl hover:bg-primary/10 transition-all">
        <View size={18} />
      </button>

      <div className="h-4 w-px bg-border-subtle"></div>

      <button
        disabled={!isPending}
        className={
          isPending
            ? "text-text-muted hover:text-green-600 p-2 rounded-xl hover:bg-green-50"
            : "text-gray-300 p-2 cursor-not-allowed"
        }
      >
        <CheckCircle size={18} />
      </button>

      <button
        disabled={!isPending}
        className={
          isPending
            ? "text-text-muted hover:text-red-600 p-2 rounded-xl hover:bg-red-50"
            : "text-gray-300 p-2 cursor-not-allowed"
        }
      >
        <XCircle size={18} />
      </button>

    </div>
  );
}