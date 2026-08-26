import type { TicketUserInfo } from "@/lib/types/admin/admin-ticket-management/ticket.userInfo";

interface Props {
  user: TicketUserInfo;
}

export default function TicketUserInfo({ user }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
      <h4 className="font-bold text-sm border-b border-b-gray-100 pb-3">
        اطلاعات کاربر
      </h4>
      <div className="flex items-center gap-3">
        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
          {user.name.charAt(0)}
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-text-main">
            {user.name}
          </span>
          <span className="text-xs text-gray-400">
            {user.level}
          </span>
        </div>
      </div>
      <div className="text-xs text-gray-500">
        تیکت‌های باز: {user.openTickets}
      </div>
    </div>
  );
}
