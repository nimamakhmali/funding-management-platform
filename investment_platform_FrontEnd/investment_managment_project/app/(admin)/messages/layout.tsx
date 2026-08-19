import { ReactNode } from "react";

import { MessagesProvider } from "@/lib/providers/MessagesProvider";

import { MobileMessagesLayout } from "@/components/pages/admin/messages/MobileMessagesLayout";

interface Props {
  messageList: ReactNode;
  messageContent: ReactNode;
}

export default function MessagesLayout({
  messageList,
  messageContent,
}: Props) {
  return (
    <MessagesProvider>
      <>
        {/* Mobile */}
        <div className="h-full lg:hidden">
          <MobileMessagesLayout
            messageList={messageList}
            messageContent={messageContent}
          />
        </div>

        {/* Desktop */}
        <div className="hidden h-full gap-6 overflow-hidden lg:flex">
          <div className="w-[420px] shrink-0">
            {messageList}
          </div>

          <div className="min-w-0 flex-1">
            {messageContent}
          </div>
        </div>
      </>
    </MessagesProvider>
  );
}