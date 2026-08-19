import { FolderOpen } from "lucide-react";
import { ProjectDocument } from "@/lib/types/project";

import DocumentItem from "./DocumentItem";

type Props = {
  documents: ProjectDocument[];
};

export default function DocumentsCard({
  documents,
}: Props) {
  return (
    <section
      className="
        rounded-2xl
        border
        border-border
        bg-white
        p-8
        shadow-sm
      "
    >
      <div className="mb-6 flex items-center gap-3">

        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-primary/10
          "
        >
          <FolderOpen className="h-5 w-5 text-primary" />
        </div>

        <h2 className="text-2xl font-extrabold">
          اسناد و مدارک
        </h2>

      </div>

      <div className="space-y-4">

        {documents.map((document) => (
          <DocumentItem
            key={document.id}
            document={document}
          />
        ))}

      </div>

      <div
        className="
          mt-5
          rounded-xl
          bg-muted/30
          p-4
          text-center
          text-sm
          text-muted-foreground
        "
      >
        برای مشاهده جزئیات فایل‌ها لطفاً وارد حساب
        کاربری شوید.
      </div>

    </section>
  );
}