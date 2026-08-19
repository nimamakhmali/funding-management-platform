import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { Message } from "@/lib/types/admin/messages/message.types";

import { MessageAvatar } from "../shared/MessageAvatar";

interface Props {
  message: Message;
}

export function MessageListItem({
  message,
}: Props) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 transition hover:border-primary/40 hover:shadow-md">
      {/* Desktop */}
      <Link
        href={`/messages/${message.id}`}
        className="hidden lg:block"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <MessageAvatar
              senderType={
                message.senderType
              }
            />

            <div>
              <p className="text-sm font-bold">
                {message.senderName}
              </p>

              <h3 className="mt-1 font-semibold">
                {message.title}
              </h3>

              <p className="mt-2 line-clamp-2 text-sm text-text-muted">
                {message.preview}
              </p>
            </div>
          </div>
        </div>
      </Link>

      {/* Mobile */}
      <div className="lg:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <MessageAvatar
              senderType={
                message.senderType
              }
            />

            <div>
              <p className="text-sm font-bold">
                {message.senderName}
              </p>

              <h3 className="mt-1 font-semibold">
                {message.title}
              </h3>

              <p className="mt-2 line-clamp-2 text-sm text-text-muted">
                {message.preview}
              </p>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}