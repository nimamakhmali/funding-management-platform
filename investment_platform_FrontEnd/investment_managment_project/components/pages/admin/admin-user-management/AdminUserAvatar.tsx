"use client";

interface Props {
  name: string;
}

export default function AdminUserAvatar({ name }: Props) {
  const initials = name
    .split(" ")
    .map((item) => item[0])
    .join(".");

  return (
    <div className="flex items-center gap-3">
      <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-black">
        {initials}
      </div>

      <span className="text-sm font-black text-[#131118]">
        {name}
      </span>
    </div>
  );
}