import {
  ShieldCheck,
  Headset,
  Megaphone,
} from "lucide-react";

import { MessageSenderType } from "@/lib/types/admin/messages/message.types";

interface Props {
  senderType: MessageSenderType;
}

export function MessageAvatar({
  senderType,
}: Props) {
  const iconMap = {
    admin: ShieldCheck,
    support: Headset,
    system: Megaphone,
  };

  const Icon = iconMap[senderType];

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
      <Icon size={20} />
    </div>
  );
}