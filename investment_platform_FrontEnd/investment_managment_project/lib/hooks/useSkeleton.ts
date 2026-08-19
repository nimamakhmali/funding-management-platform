import { useMemo } from "react";


export function useSkeleton(count: number = 6) {

  const skeletons = useMemo<number[]>(() => {
    return Array.from(
      { length: count },
      (_, index) => index
    );
  }, [count]);


  return skeletons;
}