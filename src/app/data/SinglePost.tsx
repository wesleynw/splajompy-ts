"use client";

import useSWR, { useSWRConfig } from "swr";
import { getPost } from "../lib/posts";
import { PostType } from "./posts";

const fetcher = async (post_id: number) => {
  return getPost(post_id);
};

export function useSinglePost(post_id: number) {
  const { mutate: globalMutate } = useSWRConfig();
  const { data, mutate, error } = useSWR(`post-${post_id}`, () =>
    fetcher(post_id)
  );

  const updatePost = (updatedPost: Partial<PostType>) => {
    mutate(
      (currentData: PostType | undefined) =>
        currentData
          ? {
              ...currentData,
              ...updatedPost,
            }
          : undefined,
      false
    );

    globalMutate(
      (key) => Array.isArray(key) && key[0] === "feed",
      (currentData) => {
        const newData = currentData
          ? currentData.map((post: PostType) =>
              post.post_id === updatedPost.post_id
                ? { ...post, ...updatedPost }
                : post
            )
          : undefined;
        console.log("newData", newData);
        return newData;
      },
      true
    );
  };

  const deletePost = () => {
    mutate(undefined, false);
  };

  const isLoading = !error && !data;
  const isError = !!error;

  return {
    post: data,
    isLoading,
    isError,
    updatePost,
    deletePost,
  };
}
