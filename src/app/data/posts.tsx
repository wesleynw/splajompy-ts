"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllPostsForFollowing,
  getAllPostsFromDb,
  getPostsByUserId,
} from "../lib/posts";

export type FeedType = "home" | "all" | "profile";

export type PostType = {
  post_id: number;
  text: string | null;
  postdate: string;
  user_id: number;
  poster: string;
  comment_count: number;
  imageBlobUrl: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  liked: boolean;
};

function getFetcherForPage(page: "home" | "all" | "profile", user_id?: number) {
  switch (page) {
    case "home":
      return getAllPostsForFollowing;
    case "all":
      return getAllPostsFromDb;
    case "profile":
      return (offset: number) => getPostsByUserId(offset, user_id!);
    default:
      throw new Error("Invalid page type");
  }
}

export function useFeed(page: "home" | "all" | "profile", user_id?: number) {
  const queryClient = useQueryClient();

  const fetchFeed = async ({ pageParam }: { pageParam: number }) => {
    const fetcher = getFetcherForPage(page, user_id);
    return await fetcher(pageParam);
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["feed", page],
    queryFn: fetchFeed,
    initialPageParam: 0,
    getNextPageParam: (lastPage: PostType[], pages: PostType[][]) => {
      return lastPage.length === 10 ? pages.length * 10 : undefined;
    },
  });

  const updateCachedPost = async (updatedPost: Partial<PostType>) => {
    queryClient.setQueryData<{ pages: PostType[][]; pageParams: number[] }>(
      ["feed", page],
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((posts) =>
            posts.map((post) =>
              post.post_id === updatedPost.post_id
                ? { ...post, ...updatedPost }
                : post
            )
          ),
        };
      }
    );

    console.log(
      "cache post id",
      updatedPost.post_id,
      queryClient.getQueryData(["post", updatedPost.post_id])
    );

    queryClient.setQueryData(["post", updatedPost.post_id], updatedPost);

    console.log(
      "cache post id",
      updatedPost.post_id,
      queryClient.getQueryData(["post", updatedPost.post_id])
    );
  };

  // Insert a new post at the beginning of the first page
  const insertPost = (newPost: PostType) => {
    queryClient.setQueryData<{ pages: PostType[][] }>(
      ["feed", page, user_id],
      (oldData) => {
        if (!oldData) {
          return {
            pages: [[newPost]],
            pageParams: [undefined],
          };
        }
        return {
          ...oldData,
          pages: [[newPost, ...oldData.pages[0]], ...oldData.pages.slice(1)],
        };
      }
    );
  };

  // Delete a post by ID from all pages
  const deletePost = (postId: number) => {
    queryClient.setQueryData<{ pages: PostType[][] }>(
      ["feed", page, user_id],
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((posts) =>
            posts.filter((post) => post.post_id !== postId)
          ),
        };
      }
    );
  };

  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    updateCachedPost,
    insertPost,
    deletePost,
  };
}
