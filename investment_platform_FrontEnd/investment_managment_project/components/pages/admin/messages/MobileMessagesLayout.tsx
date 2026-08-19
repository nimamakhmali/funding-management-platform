"use client";

import { ReactNode } from "react";

interface Props {
  messageList: ReactNode;
  messageContent: ReactNode;
}

export function MobileMessagesLayout({
  messageList,
  messageContent,
}: Props) {
  return (
    <div className="h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory">
      <div className="flex h-full w-[200vw]">
        <div className="w-screen shrink-0 snap-start">
          {messageList}
        </div>

        <div className="w-screen shrink-0 snap-start">
          {messageContent}
        </div>
      </div>
    </div>
  );
}