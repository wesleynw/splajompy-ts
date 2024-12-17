"use client";

import useSWRInfinite from "swr/infinite";
import { useSWRConfig } from "swr";
import {
  getAllPostsForFollowing,
  getAllPostsFromDb,
  getPost,
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

const fetcher = (
  fetcher: (offset: number, user_id: number) => Promise<PostType[]>
) => {
  return async ([, , offset, user_id]: [string, FeedType, number, number?]) => {
    return fetcher(offset, user_id ?? 0);
  };
};

const getKeyForPage = (page: FeedType, user_id?: number) => {
  const key = user_id ?? page;
  return (pageIndex: number, previousPageData: PostType[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return ["feed", key, pageIndex * 10, user_id];
  };
};

const getFetcherForPage = (page: "home" | "all" | "profile") => {
  switch (page) {
    case "home":
      return fetcher(getAllPostsForFollowing);
    case "all":
      return fetcher(getAllPostsFromDb);
    case "profile":
      return fetcher(getPostsByUserId);
    default:
      throw new Error("Invalid page type");
  }
};

export function useFeed(page: "home" | "all" | "profile", user_id?: number) {
  const { mutate: globalMutate } = useSWRConfig();
  const { data, size, setSize, mutate } = useSWRInfinite(
    getKeyForPage(page, user_id),
    getFetcherForPage(page)
  );

  const updatePost = (updatedPost: Partial<PostType>) => {
    mutate(
      (pages) =>
        pages?.map((page) =>
          page.map((post) =>
            post.post_id === updatedPost.post_id
              ? { ...post, ...updatedPost }
              : post
          )
        ),
      false
    );

    globalMutate(
      `post-${updatedPost.post_id}`,
      async () => {
        const freshPost = await getPost(updatedPost.post_id!);
        return { ...freshPost, ...updatedPost };
      },
      false
    );
  };

  const insertPost = (newPost: PostType) => {
    mutate(
      (pages) =>
        pages
          ? [pages[0] ? [newPost, ...pages[0]] : [newPost], ...pages]
          : [[newPost]],
      false
    );
  };

  const deletePost = (postId: number) => {
    mutate(
      (pages) =>
        pages?.map((page) =>
          page.filter((post: PostType) => post.post_id !== postId)
        ),
      false
    );
  };

  const hasMore = data ? data[data.length - 1].length === 10 : true;

  return {
    data,
    size,
    hasMore,
    setSize,
    updatePost,
    insertPost,
    deletePost,
  };
}
