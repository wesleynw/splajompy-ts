"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCommentsByPost } from "../lib/comments";
import { toggleLiked } from "../lib/likes";

export function useComments(post_id: number) {
  const queryClient = useQueryClient();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["comments", post_id],
    queryFn: () => getCommentsByPost(post_id),
  });

  const commentMutation = useMutation({
    mutationFn: async (comment_id: number) => {
      await toggleLiked(post_id, comment_id);
    },
    onMutate: async (comment_id) => {
      await queryClient.cancelQueries({ queryKey: ["comments", post_id] });

      const previousComments = queryClient.getQueryData(["comments", post_id]);

      queryClient.setQueryData(
        ["comments", post_id],
        (old: { comment_id: number; liked: boolean }[]) =>
          old.map((comment: { comment_id: number; liked: boolean }) =>
            comment.comment_id === comment_id
              ? { ...comment, liked: !comment.liked }
              : comment
          )
      );

      return { previousComments };
    },
    onError: (_err, _variables, context) => {
      if (context) {
        queryClient.setQueryData(
          ["comments", post_id],
          context.previousComments
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", post_id] });
    },
  });

  return {
    isPending,
    isError,
    comments: data,
    error,
    toggleLiked: commentMutation.mutate,
  };
}
