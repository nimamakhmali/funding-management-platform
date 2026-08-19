"use client";

import { Search } from "lucide-react";

import { useMessages } from "@/lib/hooks/messages/useMessages";

export function MessageSearch() {
  const {
    searchQuery,
    setSearchQuery,
  } = useMessages();

  return (
    <div className="relative">
      <Search
        size={18}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
      />

      <input
        value={searchQuery}
        onChange={(e) =>
          setSearchQuery(
            e.target.value
          )
        }
        placeholder="جستجو..."
        className="h-11 w-full rounded-xl border border-border bg-surface pr-10 pl-4 outline-none transition focus:border-primary"
      />
    </div>
  );
}
