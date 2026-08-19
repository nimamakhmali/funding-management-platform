"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";
import { useSkeleton } from "@/lib/hooks/useSkeleton";

type TableSkeletonProps = {
  title?: string;
  rows?: number;
  columns?: number;
  showToolbar?: boolean;
  showPagination?: boolean;
};

export default function TableSkeleton({
  title,
  rows = 5,
  columns = 5,
  showToolbar = true,
  showPagination = true,
}: TableSkeletonProps) {
  const rowsArray = useSkeleton(rows);
  const columnsArray = useSkeleton(columns);

  return (
    <div
      className="
        overflow-hidden
        rounded-xl
        border
        border-gray-100
        bg-white
        shadow-sm
      "
    >
      {showToolbar && (
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          {title ? <Skeleton className="h-6 w-40" /> : <div />}

          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {columnsArray.map((_, index) => (
              <TableHead key={index}>
                <Skeleton className="h-4 w-20" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {rowsArray.map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {columnsArray.map((_, columnIndex) => (
                <TableCell key={columnIndex}>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showPagination && (
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
          <Skeleton className="h-9 w-24 rounded-md" />

          <div className="flex gap-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>
      )}
    </div>
  );
}
