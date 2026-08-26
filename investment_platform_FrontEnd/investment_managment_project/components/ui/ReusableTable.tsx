"use client";

import { useState, useEffect } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import TableSkeleton from "@/components/ui/table-skeleton";
import { TableFilterDialog } from "./TableFilter";
import { TableSortButton } from "./TableSortButton";
import { TablePagination } from "./TablePagination";
import { useTableFilters } from "@/lib/hooks/useTableFilter";

export type Column<T> = {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  cellClassName?: string;
  filterable?: boolean;
  filterType?: "text" | "select" | "number" | "date";
  filterOptions?: { value: string; label: string }[];
};

const getValue = <T,>(
  row: T,
  accessor: Column<T>["accessor"],
): React.ReactNode => {
  if (typeof accessor === "function") {
    return accessor(row);
  }

  return row[accessor] as React.ReactNode;
};

type ReusableTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  title?: string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  enableFilter?: boolean;
  enableSort?: true;
  enablePagination?: boolean;
  itemsPerPage?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;

  isLoading?: boolean;
};

export function ReusableTable<T extends object>({
  data,
  columns,
  title,
  onRowClick,
  emptyMessage = "هیچ داده‌ای یافت نشد",
  enableFilter = true,
  enableSort,
  enablePagination = false,
  itemsPerPage = 10,
  currentPage: externalCurrentPage,
  totalPages: externalTotalPages,
  onPageChange,
  isLoading = false,
}: ReusableTableProps<T>) {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);

  const currentPage =
    externalCurrentPage !== undefined
      ? externalCurrentPage
      : internalCurrentPage;

  const {
    sortedData,
    sortConfig,
    localFilters,
    activeFiltersCount,
    handleFilterChange,
    applyFilters,
    resetFilters,
    handleSort,
  } = useTableFilters(data, columns);

  const getPaginatedData = (): T[] => {
    if (!enablePagination) return sortedData;

    if (externalTotalPages !== undefined) {
      return sortedData;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return sortedData.slice(startIndex, endIndex);
  };

  const paginatedData = getPaginatedData();
  const totalPages = externalTotalPages ?? Math.ceil(sortedData.length / itemsPerPage);

  const setCurrentPage = (page: number): void => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      setInternalCurrentPage(page);
    }
  };
 useEffect(() => {
  if (!enablePagination) return;

  // فقط وقتی جدول خودش صفحه را مدیریت می‌کند
  if (externalCurrentPage === undefined && currentPage !== 1) {
    setInternalCurrentPage(1);
  }
}, [sortedData.length, enablePagination, externalCurrentPage, currentPage]);

  const handleSortClick = (): void => {
    const firstSortableColumn = columns.find(
      (col) => typeof col.accessor === "string",
    );

    if (
      firstSortableColumn &&
      typeof firstSortableColumn.accessor === "string"
    ) {
      handleSort(firstSortableColumn.accessor);
    }
  };

  const hasFilterableColumns = columns.some(
    (col) => col.filterable && typeof col.accessor === "string",
  );

  if (isLoading) {
    return (
      <TableSkeleton
        title={title}
        rows={itemsPerPage}
        columns={columns.length}
        showToolbar={enableFilter || enableSort || !!title}
        showPagination={enablePagination}
      />
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-b-gray-50 flex flex-wrap gap-4 items-center justify-between">
        {title && (
          <h3 className="text-lg font-bold text-galaxy-blue">{title}</h3>
        )}

        <div className="flex gap-2">
          {enableFilter && hasFilterableColumns && (
            <TableFilterDialog
              columns={columns}
              localFilters={localFilters}
              onFilterChange={handleFilterChange}
              onApplyFilters={applyFilters}
              onResetFilters={resetFilters}
              activeFiltersCount={activeFiltersCount}
              open={filterDialogOpen}
              onOpenChange={setFilterDialogOpen}
            />
          )}

          {enableSort && (
            <TableSortButton
              onSortClick={handleSortClick}
              sortConfig={sortConfig}
            />
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary-50">
              {columns.map((column, index) => (
                <TableHead
                  key={index}
                  className={`text-right ${column.className || ""} ${
                    enableSort && typeof column.accessor === "string"
                      ? "cursor-pointer hover:bg-primary-100"
                      : ""
                  }`}
                  onClick={() => {
                    if (enableSort && typeof column.accessor === "string") {
                      handleSort(column.accessor);
                    }
                  }}
                >
                  {column.header}

                  {sortConfig?.key === column.accessor && (
                    <span className="mr-2 text-xs">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-8 text-center text-gray-500"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={
                    onRowClick
                      ? "cursor-pointer transition-colors hover:bg-gray-50"
                      : ""
                  }
                >
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className={column.cellClassName}>
                      {getValue(row, column.accessor)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {enablePagination && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
