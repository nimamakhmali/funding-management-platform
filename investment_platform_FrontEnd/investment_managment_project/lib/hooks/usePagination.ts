"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function useUrlPagination(
  pageParam = "page"
) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(
    searchParams.get(pageParam) ?? 1
  );

  const setPage = (page: number) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set(pageParam, page.toString());

    router.replace(`?${params.toString()}`);
  };

  return {
    currentPage,
    setPage,
  };
}