'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Column } from "./ReusableTable";

type FilterValue = string | number | string[];

type TableFilterDialogProps<T> = {
  columns: Column<T>[];
  localFilters: Record<string, FilterValue>;
  onFilterChange: (key: string, value: FilterValue) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  activeFiltersCount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TableFilterDialog<T extends object>({
  columns,
  localFilters,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
  activeFiltersCount,
  open,
  onOpenChange,
}: TableFilterDialogProps<T>) {
  
  const filterableColumns = columns.filter(col => col.filterable && typeof col.accessor === 'string');

  const handleApply = () => {
    onApplyFilters();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          <span>فیلتر {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
        </Button>
      </SheetTrigger>
      
<SheetContent
  side="right"
  className="
    w-full
    sm:max-w-md
    p-0
    bg-white
    border-l border-gray-200
    rounded-l-2xl
    shadow-2xl
    flex
    flex-col
"
>
  <SheetHeader className="px-6 py-5 border-b border-gray-200">
    <SheetTitle className="text-xl font-bold">
      فیلتر پیشرفته
    </SheetTitle>
  </SheetHeader>

  <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
    {filterableColumns.map((column) => {
      const key = column.accessor as string;
      const currentValue = localFilters[key] || "";

      if (column.filterType === "select" && column.filterOptions) {
        return (
          <div key={key} className="space-y-2">
            <label className="text-sm font-medium">
              {column.header}
            </label>

            <select
              value={currentValue as string}
              onChange={(e) => onFilterChange(key, e.target.value)}
              className="w-full h-11 rounded-lg px-3 outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">همه</option>

              {column.filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
      }

      return (
        <div key={key} className="space-y-2">
          <label className="text-sm font-medium">
            {column.header}
          </label>

          <input
            type={column.filterType === "number" ? "number" : "text"}
            value={currentValue}
            onChange={(e) => onFilterChange(key, e.target.value)}
            placeholder={`جستجو در ${column.header}`}
            className="w-full h-11 rounded-lg border border-gray-300 bg-white px-3 focus:outline-none focus:border-gray-400 focus:ring-0"
          />
        </div>
      );
    })}
  </div>

  <div className="border-t border-gray-200 p-6 flex gap-3">
    <Button
      variant="outline"
      className="flex-1"
      onClick={onResetFilters}
    >
      حذف فیلترها
    </Button>

    <Button
      className="flex-1 text-white"
      onClick={handleApply}
    >
      اعمال فیلتر
    </Button>
  </div>
</SheetContent>
    </Sheet>
  );
}