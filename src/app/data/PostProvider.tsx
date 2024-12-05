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
  const { allPosts, fetchSinglePost, updatePost: updateFeedPost } = useFeed();
  const [post, setPost] = useState<PostType | undefined>(undefined);

  useEffect(() => {
    const hydratePost = async () => {
      if (post_id) {
        const post = await fetchSinglePost(post_id);
        if (post) {
          setPost(post);
        }
      }
    };

    hydratePost();
  }, [post_id, allPosts, fetchSinglePost]);

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
