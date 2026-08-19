"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useSkeleton } from "@/lib/hooks/useSkeleton";

type DashboardCardSkeletonProps = {
  count?: number;
};

export default function DashboardCardSkeleton({
  count = 3,
}: DashboardCardSkeletonProps) {
  const cards = useSkeleton(count);

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((item) => (
        <div
          key={item}
          className="
            bg-white
            p-6
            rounded-2xl
            border
            border-gray-100
            shadow-sm
            hover:shadow-md
            transition-shadow
            flex
            flex-col
            gap-4
            relative
            overflow-hidden
          "
        >
          <div className="flex justify-between items-start">
            <div>
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-9 w-36" />
            </div>

            <Skeleton className="h-7 w-16 rounded-lg" />
          </div>

          <Skeleton className="mt-auto h-1.5 w-full rounded-full" />
        </div>
      ))}
    </section>
  );
}