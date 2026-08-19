"use client";

import { useMessages } from "@/lib/hooks/messages/useMessages";

import { filterMessages } from "@/lib/utils/messages/filterMessages";

import { searchMessages } from "@/lib/utils/messages/searchMessages";

import { MessageFilters } from "../list/MessageFilters";
import { MessageSearch } from "../list/MessageSearch";
import { MessageList } from "../list/MessageList";
import { NewMessageButton } from "../list/NewMessageButton";

export function MessageListContainer() {
  const {
    messages,
    filter,
    searchQuery,
  } = useMessages();

  const filteredMessages =
    searchMessages(
      filterMessages(
        messages,
        filter
      ),
      searchQuery
    );

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <NewMessageButton />
      </div>

      <MessageSearch />

      <MessageFilters />

      <MessageList
        messages={filteredMessages}
      />
    </div>
  );
}