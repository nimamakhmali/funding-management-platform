import {
  FileText,
  FileSpreadsheet,
  Archive,
  Lock,
} from "lucide-react";

import { ProjectDocument } from "@/lib/types/project";

type Props = {
  document: ProjectDocument;
};

export default function DocumentItem({
  document,
}: Props) {
  const icon =
    document.type === "pdf" ? (
      <FileText className="h-6 w-6 text-red-500" />
    ) : document.type === "excel" ? (
      <FileSpreadsheet className="h-6 w-6 text-green-600" />
    ) : (
      <Archive className="h-6 w-6 text-amber-500" />
    );

  return (
    <div
      className="
        flex
        items-center
        justify-between
        rounded-xl
        border
        border-border
        bg-white
        p-4
        transition
        hover:border-primary/30
        hover:shadow-sm
      "
    >
      <div className="flex items-center gap-4">

        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            bg-muted
          "
        >
          {icon}
        </div>

        <div>

          <h4 className="font-bold">
            {document.title}
          </h4>

          <p className="text-xs text-muted-foreground">
            {document.size}
          </p>

        </div>

      </div>

      {document.isLocked && (
        <div className="flex items-center gap-2">

          <span
            className="
              hidden
              text-xs
              text-muted-foreground
              md:block
            "
          >
            نیاز به ورود
          </span>

          <Lock className="h-4 w-4 text-muted-foreground" />

        </div>
      )}
    </div>
  );
}