"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
  useRef,
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
  fetchPosts: (page: FeedType, offset: number, user_id?: number) => void;
  checkMorePostsToFetch: (feed: FeedType) => boolean;
  fetchSinglePost: (postId: number) => Promise<PostType | undefined>;
  updatePost: (postId: number, updatedData: Partial<PostType>) => void;
  insertPostsToFeed: (feed: FeedType, posts: PostType[]) => void;
  deletePostFromFeed: (feed: FeedType, postId: number) => void;
};

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export type FeedType = "home" | "all" | "profile";

export const FeedProvider = ({ children }: { children: ReactNode }) => {
  const postMapRef = useRef<Map<number, PostType>>(new Map());

  const [homeFeed, setHomeFeed] = useState<number[]>([]);
  const [allFeed, setAllFeed] = useState<number[]>([]);
  const [profileFeed, setProfileFeed] = useState<number[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  const [morePostsToFetchMap, setMorePostsToFetchMap] = useState<{
    home: boolean;
    all: boolean;
    profile: boolean;
  }>({
    home: true,
    all: true,
    profile: true,
  });

  const fetchPosts = useCallback(
    async (
      page: "home" | "all" | "profile",
      offset: number,
      user_id?: number
    ) => {
      console.log("fetchPosts", page, offset, user_id);
      setLoading(true);
      setError(null);
      try {
        let results;
        switch (page) {
          case "home":
            results = await getAllPostsForFollowing(offset);
            break;
          case "all":
            results = await getAllPostsFromDb(offset);
            break;
          case "profile":
            if (!user_id) {
              throw new Error("user_id is required for profile feed");
            }
            results = await getPostsByUserId(user_id, offset);
            break;
          default:
            throw new Error("Invalid page type");
        }

        if (results.length < 10) {
          setMorePostsToFetchMap((prev) => ({ ...prev, [page]: false }));
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

  const checkMorePostsToFetch = useCallback(
    (feed: FeedType) => {
      return morePostsToFetchMap[feed];
    },
    [morePostsToFetchMap]
  );

  const fetchSinglePost = useCallback(async (postId: number) => {
    const currentMap = postMapRef.current;

    if (currentMap.has(postId)) {
      return currentMap.get(postId);
    }

    try {
      const result = await getPost(postId);
      if (!result) {
        throw new Error("Post not found");
      }
      updatePosts("all", [result]);
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  const updatePosts = (page: "home" | "all" | "profile", posts: PostType[]) => {
    const map = postMapRef.current;

    for (const post of posts) {
      map.set(post.post_id, post);
    }

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
    const map = postMapRef.current;

    const post = map.get(postId);
    if (post) {
      const updatedPost = { ...post, ...updatedData };
      map.set(postId, updatedPost);

      // force re-render of feeds, TODO: find a more efficient way to do this?
      setHomeFeed((prev) => [...prev]);
      setAllFeed((prev) => [...prev]);
      setProfileFeed((prev) => [...prev]);
    }
  };

  const insertPostsToFeed = (feed: FeedType, posts: PostType[]) => {
    const map = postMapRef.current;

    for (const post of posts) {
      map.set(post.post_id, post);
    }

    if (feed === "home") {
      setHomeFeed((prev) => [
        ...new Set([...posts.map((post) => post.post_id), ...prev]),
      ]);
    } else if (feed === "profile") {
      setProfileFeed((prev) => [
        ...new Set([...posts.map((post) => post.post_id), ...prev]),
      ]);
    }

    setAllFeed((prev) => [
      ...new Set([...posts.map((post) => post.post_id), ...prev]),
    ]);
  };

  const deletePostFromFeed = (feed: FeedType, postId: number) => {
    const map = postMapRef.current;

    map.delete(postId);

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
        .map((id) => postMapRef.current.get(id))
        .filter((post): post is PostType => Boolean(post)),
    [homeFeed]
  );
  const getAllPosts = useCallback(
    () =>
      allFeed
        .map((id) => postMapRef.current.get(id))
        .filter((post): post is PostType => Boolean(post)),
    [allFeed]
  );
  const getProfilePosts = useCallback(() => {
    return profileFeed
      .map((id) => postMapRef.current.get(id))
      .filter((post): post is PostType => Boolean(post));
  }, [profileFeed]);

  const value = useMemo(
    () => ({
      getHomePosts,
      getAllPosts,
      getProfilePosts,
      loading,
      error,
      checkMorePostsToFetch,
      fetchPosts,
      fetchSinglePost,
      updatePost,
      insertPostsToFeed,
      deletePostFromFeed,
    }),
    [
      getHomePosts,
      getAllPosts,
      getProfilePosts,
      loading,
      error,
      checkMorePostsToFetch,
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
