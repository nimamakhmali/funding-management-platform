"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function useQueryParams<T extends Record<string, unknown>>() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getAll = (): Partial<T> => {
    const result = {} as Partial<T>;

    searchParams.forEach((value, key) => {
      try {
        result[key as keyof T] = JSON.parse(value);
      } catch {
        result[key as keyof T] = value as T[keyof T];
      }
    });

    return result;
  };

  const setParams = (values: Partial<T>) => {
  const params = new URLSearchParams(searchParams.toString());

  Object.entries(values).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      params.delete(key);
      return;
    }

    if (typeof value === "string") {
      params.set(key, value);
    } else {
      params.set(key, JSON.stringify(value));
    }
  });

  router.replace(`?${params.toString()}`);
};

   const set = (key: keyof T, value: string) => {
    setParams({ [key]: value } as Partial<T>);
  };

   const clear = () => {
    router.replace(window.location.pathname);

    router.refresh();
  };

   return {
     getAll,
     setParams,
     set,
     clear,
   };
 }
