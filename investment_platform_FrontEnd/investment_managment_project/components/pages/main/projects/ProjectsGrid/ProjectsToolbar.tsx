

import { LayoutGrid } from "lucide-react";

type Props = {
  count: number;
};

export default function ProjectsToolbar({ count }: Props) {
  return (
    <div
      className="
        mt-8
        flex
        items-center
        justify-between
        rounded-xl
        border
        border-border
        bg-white
        px-5
        py-4
      "
    >
      <div className="flex items-center gap-2">
        <LayoutGrid className="h-4 w-4 text-primary" />

        <span className="font-bold">فرصت‌های موجود</span>
      </div>

      <div
        className="
          rounded-lg
          bg-primary/10
          px-3
          py-1
          text-sm
          font-bold
          text-primary
        "
      >
        {count} پروژه
      </div>
    </div>
  );
}
