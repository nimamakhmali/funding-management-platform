import Link from "next/link";
import { Notification } from "@/lib/types/admin/notification/notification-types";
import { notificationConfig } from "@/lib/constants/admin/notification/notification-config";
interface NotificationCardProps {
  notification: Notification;
}

const variants = {
  project: {
    icon: "bg-primary/10 text-primary",
    indicator: "bg-primary",
  },

  finance: {
    icon: "bg-emerald-100 text-emerald-600",
    indicator: "bg-emerald-500",
  },

  system: {
    icon: "bg-amber-100 text-amber-600",
    indicator: "bg-amber-500",
  },

  message: {
    icon: "bg-sky-100 text-sky-600",
    indicator: "bg-sky-500",
  },
};

export default function NotificationCard({
  notification,
}: NotificationCardProps) {
const variant =
  notificationConfig[notification.type];

const Icon = variant.icon;

  return (
    <article
      className={`
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        transition-all
        duration-300
        hover:shadow-lg
        hover:-translate-y-1
        ${
          notification.read
            ? "border-gray-200 bg-white"
            : "border-gray-200"
        }
      `}
    >
      <span
className={`
absolute
right-0
top-0
bottom-0
w-1
rounded-r-full
${variant.indicatorClassName}
`}
/>
      <div className="flex gap-4 p-5">

        <div
  className={`
      flex
      size-12
      shrink-0
      items-center
      justify-center
      rounded-xl
      ${variant.iconClassName}
  `}
>
    <Icon size={22}/>
</div>

        <div className="flex flex-1 flex-col">

          <div className="flex items-start justify-between gap-3">

            <h3 className="font-bold text-slate-900">
              {notification.title}
            </h3>

            <span
              className={`
                flex
                items-center
                gap-2
                text-xs
                ${
                  notification.read
                    ? "text-slate-400"
                    : "text-primary"
                }
              `}
            >
              {!notification.read && (
                <span className="size-2 rounded-full bg-primary animate-pulse" />
              )}

              {notification.createdAt}
            </span>
          </div>

          <p className="mt-2 text-sm leading-7 text-slate-500">
            {notification.description}
          </p>

          <Link
            href={notification.action.href}
            className="
              mt-4
              w-fit
              text-sm
              font-semibold
              text-primary
              transition-colors
              hover:text-primary-hover
            "
          >
            {notification.action.label}
          </Link>

        </div>

      </div>
    </article>
  );
}