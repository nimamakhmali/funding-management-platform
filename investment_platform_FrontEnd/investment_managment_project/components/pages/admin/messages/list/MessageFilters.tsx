"use client";

import { MESSAGE_FILTER_TABS } from "@/lib/constants/admin/messages/messages.constants";

import { useMessages } from "@/lib/hooks/messages/useMessages";

export function MessageFilters() {
  const {
    filter,
    setFilter,
  } = useMessages();

  return (
    <div className="flex gap-2 overflow-auto">
      {MESSAGE_FILTER_TABS.map(
        (tab) => (
          <button
            key={tab.value}
            onClick={() =>
              setFilter(tab.value)
            }
            className={
              filter === tab.value
                ? "rounded-full bg-primary px-4 py-2 text-sm font-medium text-white"
                : "rounded-full border border-border bg-surface px-4 py-2 text-sm text-text-muted"
            }
          >
            {tab.label}
          </button>
        )
      )}
    </div>
  );
}