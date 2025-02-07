"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toggleLiked } from "../lib/likes";
import { fetchPosts } from "../lib/posts";
import { PostType } from "./posts";

export function useSinglePost(post_id: number) {
  const queryClient = useQueryClient();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["post", post_id],
    queryFn: async () => (await fetchPosts(undefined, undefined, post_id))[0],
  });

  const updatePost = (updatedPost: Partial<PostType>) => {
    queryClient.setQueryData<PostType>(
      ["post", String(post_id)],
      (currentData) => {
        if (!currentData) return currentData;
        return { ...currentData, ...updatedPost };
      }
    );
  };

  const likedMutation = useMutation({
    mutationFn: () => toggleLiked(post_id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["post", post_id] });

      const previousPost = queryClient.getQueryData<PostType>([
        "post",
        post_id,
      ]);

      if (previousPost) {
        queryClient.setQueryData(["post", post_id], {
          ...previousPost,
          liked: !previousPost.liked,
        });
      }

      return { previousPost };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(["post", post_id], context.previousPost);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["post", post_id] });
    },
  });

  return {
    isPending,
    isError,
    post: data,
    error,
    updatePost,
    toggleLiked: likedMutation.mutate,
  };
}
