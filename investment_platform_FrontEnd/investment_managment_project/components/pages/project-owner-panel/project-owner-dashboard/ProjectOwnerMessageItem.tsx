import { ProjectOwnerMessage } from "@/lib/types/project-owner-panel/project-owner-dashboard/projectOwnerMessage";

type ProjectOwnerMessageItemProps = {
  message: ProjectOwnerMessage;
};

export default function ProjectOwnerMessageItem({
  message,
}: ProjectOwnerMessageItemProps) {
  return (
    <div
      className={`relative cursor-pointer overflow-hidden p-5 transition-colors hover:bg-slate-50 ${
        message.isUnread ? "border-r-4 border-r-primary" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex size-10 items-center justify-center rounded-full ${message.iconClassName}`}
        >
          {message.icon}
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center justify-between">
            <h5
              className={`text-sm font-bold ${
                message.isUnread
                  ? "text-text-main hover:text-primary"
                  : "text-text-main"
              }`}
            >
              {message.title}
            </h5>

            {message.isUnread && (
              <span className="size-2 rounded-full bg-primary" />
            )}
          </div>

          <p className="line-clamp-2 text-[11px] leading-relaxed text-text-secondary">
            {message.description}
          </p>

          <span className="mt-1 text-[10px] text-slate-400">
            {message.time}
          </span>
        </div>
      </div>
    </div>
  );
}