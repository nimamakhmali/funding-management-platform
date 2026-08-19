"use client";

interface Props {
  email: string;
  id: number;
}

export default function AdminUserInfo({
  email,
  id,
}: Props) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-bold text-gray-700">
        {email}
      </span>

      <span className="text-[10px] text-gray-400 font-black persian-num">
        شناسه: {id.toLocaleString("fa-IR")}
      </span>
    </div>
  );
}