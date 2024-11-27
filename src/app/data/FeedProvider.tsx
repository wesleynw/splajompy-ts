"use client";

import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { getAllPosts, getAllPostsForFollowing } from "../lib/posts";

export type Post = {
  post_id: number;
  text: string | null;
  postdate: string;
  user_id: number;
  poster: string;
  comment_count: number;
  imageBlobUrl: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
};

type FeedContextType = {
  posts: Post[];
  allPosts: Post[];
  setPosts: (posts: Post[]) => void;
  setAllPosts: (allPosts: Post[]) => void;
  refreshPosts: (userId: number) => Promise<void>;
  refreshAllPosts: () => Promise<void>;
};

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const FeedProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  const refreshPosts = async (userId: number) => {
    try {
      const results = await getAllPostsForFollowing(userId);
      setPosts(results);
    } catch (error) {
      console.error("Failed to refresh following posts:", error);
    }
  };

  const refreshAllPosts = async () => {
    try {
      const results = await getAllPosts();
      setAllPosts(results);
    } catch (error) {
      console.error("Failed to refresh all posts:", error);
    }
  };

  const value = useMemo(
    () => ({
      posts,
      allPosts,
      setPosts,
      setAllPosts,
      refreshPosts,
      refreshAllPosts,
    }),
    [posts, allPosts]
  );

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
};

export const useFeed = () => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error("useFeed must be used within a FeedProvider");
  }
  return context;
};
