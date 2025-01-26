"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPostById } from "../lib/posts";
import { PostType } from "./posts";
import { toggleLiked } from "../lib/likes";

export function useSinglePost(post_id: number) {
  const queryClient = useQueryClient();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["post", post_id],
    queryFn: () => getPostById(post_id),
  });

  const updatePost = (updatedPost: Partial<PostType>) => {
    // Update the single post query data
    queryClient.setQueryData<PostType>(
      ["post", String(post_id)],
      (currentData) => {
        if (!currentData) return currentData;
        return { ...currentData, ...updatedPost };
      }
    );

    // Now we want to also reflect this update in the feed queries.
    // If we know exactly which feed queries need updating, we can do something like:
    // For example, if feed queries are ["feed", "home"], ["feed", "all"], ["feed", "profile", user_id], etc.
    // We could do:
    // queryClient.setQueryData(["feed", "home"], oldData => ...)
    // queryClient.setQueryData(["feed", "profile", user_id], oldData => ...)
    //
    // Without knowledge of the exact keys or wanting complex logic, we can just invalidate them:
    // queryClient.invalidateQueries(["feed"]);
  };

  const deletePost = () => {
    // Deleting the post means we set it to undefined locally
    queryClient.setQueryData(["post", post_id], undefined);

    // Invalidate feed queries so they refetch without this post
    // queryClient.invalidateQueries(["feed"]);
  };

  // NEW AREA: now we're trying out optimistic mutations, rather than just cache changes

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
    deletePost,
    toggleLiked: likedMutation.mutate,
  };
}
