import { ReactNode } from "react";

interface SecurityItemProps {
  title: string;
  description: string;
  action: ReactNode;
}

export function SecurityItem({
  title,
  description,
  action,
}: SecurityItemProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-gray-900">
          {title}
        </h3>

        <p className="text-xs text-gray-500">
          {description}
        </p>
      </div>

      {action}
    </div>
  );
}