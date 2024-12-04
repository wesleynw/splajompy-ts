"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
} from "react";
import { useFeed, PostType } from "./FeedProvider";

export type PostContextType = {
  post: PostType | undefined;
  updatePost: (updatedData: Partial<PostType>) => void;
};

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({
  children,
  post_id,
}: {
  children: React.ReactNode;
  post_id: number;
}) => {
  const { allPosts, fetchFeed, updatePost: updateFeedPost } = useFeed();
  const [post, setPost] = useState<PostType | undefined>(undefined);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const foundPost = allPosts.find((p) => p.post_id == post_id);

    if (foundPost != null) {
      setPost(foundPost);
    } else if (!hasFetched) {
      setHasFetched(true);
      fetchFeed(false).catch((err) =>
        console.error("Failed to fetch feed:", err)
      );
    }
  }, [post_id, allPosts, hasFetched, fetchFeed]);

  const updatePost = useMemo(
    () => (updatedData: Partial<PostType>) => {
      if (post) {
        const updatedPost = { ...post, ...updatedData };
        setPost(updatedPost);
        updateFeedPost(post.post_id, updatedData);
      }
    },
    [post, updateFeedPost]
  );

  const value = useMemo(
    () => ({
      post,
      updatePost,
    }),
    [post, updatePost]
  );

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePost must be used within a PostProvider");
  }
  return context;
};
