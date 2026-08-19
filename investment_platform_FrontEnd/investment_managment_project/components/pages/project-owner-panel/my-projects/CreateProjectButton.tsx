import Link from "next/link";
import clsx from "clsx";
import { Plus } from "lucide-react";

export default function CreateProjectButton() {
  return (
    <Link href="/create-project">
      <button
        className={clsx(
          "excel-exit-button",
          "flex items-center gap-2 px-5 h-11 rounded-xl border border-gray-200 bg-primary text-gray-50 text-sm font-medium transition-all cursor-pointer",
        )}
      >
        <Plus />
        <span>ایجاد پروژه جدید</span>
      </button>
    </Link>
  );
}