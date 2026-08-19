import { ReactNode } from "react";

type TicketManagementButtonProps = {
  icon: ReactNode;
  text: string;
  className?: string;
  onClick?: () => void;
};

export default function TicketManagementButton({
  icon,
  text,
  className,
  onClick,
}: TicketManagementButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all ${className}`}
    >
      {icon}

      <span>{text}</span>
    </button>
  );
}