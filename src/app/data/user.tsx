"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserByUsername } from "../lib/users";

export function useUser(username: string) {
  const { isPending, isError, data } = useQuery({
    queryKey: ["user", username],
    queryFn: () => getUserByUsername(username),
  });

  return { isPending, isError, user: data };
}
