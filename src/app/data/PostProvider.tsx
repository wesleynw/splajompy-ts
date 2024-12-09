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
  loading: boolean;
};

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({
  children,
  post_id,
}: {
  children: React.ReactNode;
  post_id: number;
}) => {
  const { fetchSinglePost, updatePost: updateFeedPost } = useFeed();
  const [post, setPost] = useState<PostType | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPost = fetchSinglePost;
    const hydratePost = async () => {
      setLoading(true);
      if (post_id) {
        try {
          const post = await fetchPost(post_id);
          setPost(post);
        } catch (err) {
          console.error(err);
        }
      }
      setLoading(false);
    };

    hydratePost();
  }, [post_id, fetchSinglePost]);

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
      loading,
    }),
    [post, updatePost, loading]
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
