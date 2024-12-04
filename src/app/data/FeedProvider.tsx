"use client";

import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { getAllPosts, getAllPostsForFollowing } from "../lib/posts";

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

type FeedContextType = {
  posts: PostType[];
  allPosts: PostType[];
  loading: boolean;
  error: unknown | null;
  fetchFeed: (fetchAllPosts: boolean) => Promise<void>;
  updatePost: (postId: number, updatedData: Partial<PostType>) => void;
  insertPostToFeed: (post: PostType) => void;
  deletePostFromFeed: (postId: number) => void;
};

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const FeedProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [allPosts, setAllPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown | null>(null);

  // todo: feed provider fetch posts in useEffect

  const fetchFeed = async (fetchAllPosts: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const results = fetchAllPosts
        ? await getAllPosts()
        : await getAllPostsForFollowing();
      if (fetchAllPosts) {
        setAllPosts(results);
      } else {
        setPosts(results);
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const updatePost = (postId: number, updatedData: Partial<PostType>) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.post_id === postId ? { ...post, ...updatedData } : post
      )
    );
    setAllPosts((prev) =>
      prev.map((post) =>
        post.post_id === postId ? { ...post, ...updatedData } : post
      )
    );
  };

  const insertPostToFeed = (post: PostType) => {
    setPosts((prev) => [post, ...prev]);
    setAllPosts((prev) => [post, ...prev]);
  };

  const deletePostFromFeed = (postId: number) => {
    setPosts((prev) => prev.filter((post) => post.post_id !== postId));
    setAllPosts((prev) => prev.filter((post) => post.post_id !== postId));
  };

  const value = useMemo(
    () => ({
      posts,
      allPosts,
      loading,
      error,
      fetchFeed,
      updatePost,
      insertPostToFeed,
      deletePostFromFeed,
    }),
    [posts, allPosts, loading, error]
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
