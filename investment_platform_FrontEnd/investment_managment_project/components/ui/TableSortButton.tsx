// components/ui/TableSortButton.tsx
'use client';

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { SortConfig } from '@/lib/hooks/useTableFilter';

type TableSortButtonProps<T> = {
  onSortClick: () => void;
  sortConfig: SortConfig<T>; 
};

export function TableSortButton<T extends object>({
  onSortClick,
  sortConfig,
}: TableSortButtonProps<T>) {
  return (
    <Button 
      variant="outline"
      onClick={onSortClick}
      className="flex items-center gap-2"
    >
      <ArrowUpDown className="w-4 h-4" />
      <span>مرتب‌سازی {sortConfig && `(${sortConfig.direction === 'asc' ? 'صعودی' : 'نزولی'})`}</span>
    </Button>
  );
}