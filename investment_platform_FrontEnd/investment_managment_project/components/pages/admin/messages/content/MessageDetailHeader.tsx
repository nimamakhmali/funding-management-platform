"use client";

import { useRouter } from "next/navigation";

import {
  Archive,
  Trash2,
  ArrowRight,
} from "lucide-react";

import { Message } from "@/lib/types/admin/messages/message.types";

import { useMessages } from "@/lib/hooks/messages/useMessages";

import { formatPersianDate } from "@/lib/utils/messages/formatPersianDate";

import { MessageAvatar } from "../shared/MessageAvatar";

interface Props {
  message: Message;
}

export function MessageDetailHeader({
  message,
}: Props) {
  const router = useRouter();

  const {
    archiveMessage,
    deleteMessage,
  } = useMessages();

  return (
    <div className="border-b border-border p-6">
      {/* Mobile Back Button */}
      <div className="mb-4 flex lg:hidden">
        <button
          onClick={() =>
            router.push("/messages")
          }
          className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-medium transition hover:bg-gray-50"
        >
          <ArrowRight size={16} />
          بازگشت
        </button>
      </div>

      <div className="flex justify-between gap-4">
        <div className="flex gap-3">
          <MessageAvatar
            senderType={
              message.senderType
            }
          />

          <div>
            <h2 className="text-lg font-bold">
              {message.title}
            </h2>

            <p className="text-sm text-text-muted">
              {message.senderName}
            </p>

            <p className="text-xs text-text-muted">
              {message.senderEmail}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() =>
              archiveMessage(
                message.id
              )
            }
            className="rounded-lg border border-border p-2 transition hover:bg-gray-50"
          >
            <Archive size={18} />
          </button>

          <button
            onClick={() =>
              deleteMessage(
                message.id
              )
            }
            className="rounded-lg border border-border p-2 text-red-500 transition hover:bg-red-50"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="mt-4 text-sm text-text-muted">
        {formatPersianDate(
          message.createdAt
        )}
      </div>
    </div>
  );
}