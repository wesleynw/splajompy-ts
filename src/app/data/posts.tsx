"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toggleLiked } from "../lib/likes";
import { deletePost, EnhancedPost, fetchPosts } from "../lib/posts";

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

type FetchOptions = {
  offset?: number;
  target_following_only?: boolean;
  target_post_id?: number | null;
  target_user_id?: number | null;
};

export function usePosts({
  target_following_only = false,
  target_post_id = null,
  target_user_id = null,
}: FetchOptions = {}) {
  const queryClient = useQueryClient();

  const fetcher = async ({ pageParam }: { pageParam: number }) => {
    return await fetchPosts(
      pageParam,
      target_following_only,
      target_post_id,
      target_user_id
    );
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
    queryKey: ["feed", target_following_only, target_post_id, target_user_id],
    queryFn: fetcher,
    initialPageParam: 0,
    getNextPageParam: (lastPage: EnhancedPost[], pages: EnhancedPost[][]) => {
      return lastPage.length === 10 ? pages.length * 10 : undefined;
    },
  });

  const updateCachedPost = async (updatedPost: Partial<PostType>) => {
    queryClient.setQueryData<{ pages: PostType[][]; pageParams: number[] }>(
      ["feed", target_following_only, target_post_id, target_user_id],
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

    queryClient.setQueryData(["post", updatedPost.post_id], updatedPost);
  };

  const insertPost = (newPost: PostType) => {
    queryClient.setQueryData<{ pages: PostType[][] }>(
      ["feed", target_following_only, target_post_id, target_user_id],
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

  const deletePostMutation = useMutation({
    mutationFn: (post_id: number) => deletePost(post_id),
    onMutate: async (post_id: number) => {
      queryClient.setQueriesData<{ pages: PostType[][] }>(
        { queryKey: ["feed"] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((posts) =>
              posts.filter((post) => post.post_id !== post_id)
            ),
          };
        }
      );
    },
  });

  const likedMutation = useMutation({
    mutationFn: (post_id: number) => toggleLiked(post_id),
    onMutate: async (post_id) => {
      await queryClient.cancelQueries({
        queryKey: [
          "feed",
          target_following_only,
          target_post_id,
          target_user_id,
        ],
      });

      const previousPosts = queryClient.getQueryData<{ pages: PostType[][] }>([
        "feed",
        target_following_only,
        target_post_id,
        target_user_id,
      ]);

      if (previousPosts) {
        queryClient.setQueryData(
          ["feed", target_following_only, target_post_id, target_user_id],
          {
            ...previousPosts,
            pages: previousPosts.pages.map((posts) =>
              posts.map((post) =>
                post.post_id === post_id
                  ? { ...post, liked: !post.liked }
                  : post
              )
            ),
          }
        );
      }

      return { previousPosts };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(
          ["feed", target_following_only, target_post_id, target_user_id],

          context.previousPosts
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "feed",
          target_following_only,
          target_post_id,
          target_user_id,
        ],
      });
    },
  });

  return {
    posts: data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    updateCachedPost,
    insertPost,
    deletePost: deletePostMutation.mutate,
    toggleLiked: likedMutation.mutate,
  };
}
