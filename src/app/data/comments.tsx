"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCommentsByPost } from "../lib/comments";

export function useComments(post_id: number) {
  const queryClient = useQueryClient();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["comments", post_id],
    queryFn: () => getCommentsByPost(post_id),
  });

  const refreshComments = async () => {
    queryClient.invalidateQueries({ queryKey: ["comments", post_id] });
  };

  return { isPending, isError, comments: data, error, refreshComments };
}
