"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import {
  getAllPostsFromDb,
  getAllPostsForFollowing,
  getPost,
  getPostsByUserId,
} from "../lib/posts";

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
  getHomePosts: () => PostType[];
  getAllPosts: () => PostType[];
  getProfilePosts: () => PostType[];
  loading: boolean;
  error: unknown;
  fetchPosts: (page: "home" | "all" | "profile", user_id?: number) => void;
  fetchSinglePost: (postId: number) => Promise<PostType | undefined>;
  updatePost: (postId: number, updatedData: Partial<PostType>) => void;
  insertPostToFeed: (feed: FeedType, post: PostType) => void;
  deletePostFromFeed: (feed: FeedType, postId: number) => void;
};

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export type FeedType = "home" | "all" | "profile";

export const FeedProvider = ({ children }: { children: ReactNode }) => {
  const [postMap, setPostMap] = useState<Map<number, PostType>>(new Map());

  const [homeFeed, setHomeFeed] = useState<number[]>([]);
  const [allFeed, setAllFeed] = useState<number[]>([]);
  const [profileFeed, setProfileFeed] = useState<number[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  const fetchPosts = useCallback(
    async (page: "home" | "all" | "profile", user_id?: number) => {
      setLoading(true);
      setError(null);
      try {
        let results;
        switch (page) {
          case "home":
            results = await getAllPostsFromDb();
            break;
          case "all":
            results = await getAllPostsForFollowing();
            break;
          case "profile":
            if (!user_id) {
              throw new Error("user_id is required for profile feed");
            }
            results = await getPostsByUserId(user_id);
            break;
          default:
            throw new Error("Invalid page type");
        }
        updatePosts(page, results);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchSinglePost = useCallback(
    async (postId: number) => {
      setLoading(true);
      setError(null);

      if (postMap.has(postId)) {
        setLoading(false);
        return postMap.get(postId);
      }

      try {
        const result = await getPost(postId);
        if (!result) {
          throw new Error("Post not found");
        }

        // Update the postMap and feeds
        updatePosts("all", [result]);

        // Return the fetched post directly
        return result;
      } catch (err) {
        setError(err);
        console.error(err);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [postMap]
  );

  const updatePosts = (page: "home" | "all" | "profile", posts: PostType[]) => {
    setPostMap((prev) => {
      const newMap = new Map(prev);
      posts.forEach((post) => {
        newMap.set(post.post_id, post);
      });
      return newMap;
    });

    const postIds = posts.map((post) => post.post_id);

    if (page === "home") {
      setHomeFeed((prev) => [...new Set([...prev, ...postIds])]);
    }

    if (page === "all") {
      setAllFeed((prev) => [...new Set([...prev, ...postIds])]);
    }

    if (page === "profile") {
      setProfileFeed(postIds);
    }
  };

  const updatePost = (postId: number, updatedData: Partial<PostType>) => {
    setPostMap((prev) => {
      const post = prev.get(postId);
      if (!post) {
        return prev;
      }
      return new Map(prev).set(postId, { ...post, ...updatedData });
    });
  };

  const insertPostToFeed = (feed: FeedType, post: PostType) => {
    setPostMap((prev) => new Map(prev).set(post.post_id, post));
    if (feed === "home") {
      setHomeFeed((prev) => [post.post_id, ...prev]);
    } else if (feed === "all") {
      setAllFeed((prev) => [post.post_id, ...prev]);
    } else if (feed === "profile") {
      setProfileFeed((prev) => [post.post_id, ...prev]);
    }
  };

  const deletePostFromFeed = (feed: FeedType, postId: number) => {
    setPostMap((prev) => {
      const newMap = new Map(prev);
      newMap.delete(postId);
      return newMap;
    });

    if (feed === "home") {
      setHomeFeed((prev) => prev.filter((id) => id !== postId));
    } else if (feed === "all") {
      setAllFeed((prev) => prev.filter((id) => id !== postId));
    } else if (feed === "profile") {
      setProfileFeed((prev) => prev.filter((id) => id !== postId));
    }
  };

  const getHomePosts = useCallback(
    () =>
      homeFeed
        .map((id) => postMap.get(id))
        .filter((post): post is PostType => Boolean(post)),
    [homeFeed, postMap]
  );
  const getAllPosts = useCallback(
    () =>
      allFeed
        .map((id) => postMap.get(id))
        .filter((post): post is PostType => Boolean(post)),
    [allFeed, postMap]
  );
  const getProfilePosts = useCallback(() => {
    return profileFeed
      .map((id) => postMap.get(id))
      .filter((post): post is PostType => Boolean(post));
  }, [profileFeed, postMap]);

  const value = useMemo(
    () => ({
      getHomePosts,
      getAllPosts,
      getProfilePosts,
      loading,
      error,
      fetchPosts,
      fetchSinglePost,
      updatePost,
      insertPostToFeed,
      deletePostFromFeed,
    }),
    [
      getHomePosts,
      getAllPosts,
      getProfilePosts,
      loading,
      error,
      fetchPosts,
      fetchSinglePost,
    ]
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
