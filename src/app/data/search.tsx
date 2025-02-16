"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserByUsernameSearch } from "../lib/users";

export function useSearch(queryString: string) {
  const { isPending, isError, data } = useQuery({
    queryKey: ["search", queryString],
    queryFn: () => getUserByUsernameSearch(queryString),
  });

  return {
    isPending,
    isError,
    data,
  };
}
