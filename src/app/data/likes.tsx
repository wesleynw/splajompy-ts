"use client";

import { useQuery } from "@tanstack/react-query";
import { getRelevantLikes } from "../lib/likes";

export function useOtherLikes(post_id: number) {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["likes", post_id],
    queryFn: () => getRelevantLikes(post_id),
  });

  return { isPending, isError, data, error };
}
