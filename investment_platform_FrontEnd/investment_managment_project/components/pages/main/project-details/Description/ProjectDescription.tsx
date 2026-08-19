import { FileText } from "lucide-react";

type Props = {
  description: string;
};

export default function ProjectDescription({
  description,
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
          <FileText className="h-5 w-5 text-primary" />
        </div>

        <h2 className="text-2xl font-extrabold">
          معرفی پروژه
        </h2>
      </div>

      <div
        className="
          whitespace-pre-line
          leading-9
          text-muted-foreground
        "
      >
        {description}
      </div>
    </section>
  );
}