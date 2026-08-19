import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function AccountSettingsSection({
  title,
  children,
  icon,
  action,
  className,
  contentClassName,
}: SectionProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm mt-4",
        className
      )}
    >
      <header className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
        <div className="flex items-center gap-2">
          {icon}

          <h2 className="text-lg font-bold text-gray-900">
            {title}
          </h2>
        </div>

        {action}
      </header>

      <div className={cn("p-6", contentClassName)}>
        {children}
      </div>
    </section>
  );
}