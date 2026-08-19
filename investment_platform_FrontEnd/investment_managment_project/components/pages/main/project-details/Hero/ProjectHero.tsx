import Image from "next/image";
import { Project } from "@/lib/types/project";
const statusConfig = {
  active: {
    label: "در حال تأمین مالی",
    className:
      "bg-green-50 text-green-700 border-green-200",
  },

  funded: {
    label: "تکمیل تأمین مالی",
    className:
      "bg-blue-50 text-blue-700 border-blue-200",
  },

  closed: {
    label: "بسته شده",
    className:
      "bg-gray-100 text-gray-700 border-gray-200",
  },
};

type Props = {
  project: Project;
};

export default function ProjectHero({
  project,
}: Props) {
  const status = statusConfig[project.status];

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">

      <div className="relative h-72">

        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-5 right-5">

          <span
            className="
              mb-3
              inline-flex
              rounded-full
              bg-white/90
              px-3
              py-1
              text-xs
              font-bold
              backdrop-blur
            "
          >
            {project.industry}
          </span>

          <h1 className="text-3xl font-extrabold text-white">
            {project.title}
          </h1>

        </div>

      </div>

      <div className="space-y-4 p-6">

        <div className="flex flex-wrap items-center gap-3">

          <span
            className={`
              rounded-full
              border
              px-3
              py-1
              text-xs
              font-bold
              ${status.className}
            `}
          >
            {status.label}
          </span>

          <span className="text-sm text-muted-foreground">
            شناسه پروژه:
            <span className="mr-1 font-bold">
              {project.projectCode}
            </span>
          </span>

        </div>

        <p className="leading-8 text-muted-foreground">
          {project.shortDescription}
        </p>

      </div>

    </section>
  );
}