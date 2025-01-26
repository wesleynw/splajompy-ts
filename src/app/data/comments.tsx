"use client";

import { PublicUser, User } from "@/db/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CommentWithLike,
  getCommentsByPost,
  insertComment,
} from "../lib/comments";
import { toggleLiked } from "../lib/likes";

type commentsDTO = {
  comment: CommentWithLike;
  user: User;
}[];

export function useComments(user: PublicUser, post_id: number) {
  const queryClient = useQueryClient();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["comments", post_id],
    queryFn: () => getCommentsByPost(post_id),
  });

  const addComment = useMutation({
    mutationFn: (text: string) => insertComment(post_id, text),
    onMutate: async (text: string) => {
      await queryClient.cancelQueries({ queryKey: ["comments", post_id] });

      const previousComments = queryClient.getQueryData(["comments", post_id]);

      const newComment = {
        comment: {
          comment_id: -1,
          text,
          date: new Date(),
          user_id: user.user_id,
          post_id,
        },
        user: {
          user_id: user.user_id,
          username: user.username,
        },
      };

      queryClient.setQueryData(["comments", post_id], (old: commentsDTO) =>
        old ? [newComment, ...old] : [newComment]
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

  const likedMutation = useMutation({
    mutationFn: async (comment_id: number) => {
      await toggleLiked(post_id, comment_id);
    },
    onMutate: async (comment_id) => {
      await queryClient.cancelQueries({ queryKey: ["comments", post_id] });

      const previousComments = queryClient.getQueryData(["comments", post_id]);

      queryClient.setQueryData(["comments", post_id], (old: commentsDTO) =>
        old?.map((comment) =>
          comment.comment.comment_id === comment_id
            ? {
                ...comment,
                comment: {
                  ...comment.comment,
                  isLiked: !comment.comment.isLiked,
                },
              }
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
    toggleLiked: likedMutation.mutate,
    addComment: addComment.mutate,
  };
}
