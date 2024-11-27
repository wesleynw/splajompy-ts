"use client";

import { useEffect, useState, useMemo } from "react";
import { Box, CircularProgress } from "@mui/material";
import Post from "../post/Post";
import { getAllPosts, getAllPostsForFollowing } from "../../lib/posts";
import { useFeed } from "../../data/FeedProvider";
import { SessionProvider } from "next-auth/react";
import NewPost from "../post/NewPost/NewPost";
import EmptyFeed from "./EmptyFeed";
import { Session } from "next-auth";

export default function Feed({
  session,
  fetchAllPosts,
  showNewPost,
}: Readonly<{
  session: Session;
  fetchAllPosts: boolean;
  showNewPost: boolean;
}>) {
  const { posts, setPosts, allPosts, setAllPosts } = useFeed();
  const [loading, setLoading] = useState(
    fetchAllPosts ? allPosts.length === 0 : posts.length === 0
  );
  const [error, setError] = useState<unknown>(null);

  const currentPosts = fetchAllPosts ? allPosts : posts;
  const setCurrentPosts = fetchAllPosts ? setAllPosts : setPosts;

  useEffect(() => {
    if (currentPosts.length > 0) return;

    const fetchPosts = async () => {
      try {
        const results = fetchAllPosts
          ? await getAllPosts()
          : await getAllPostsForFollowing(session.user.user_id);
        setCurrentPosts(results);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [
    fetchAllPosts,
    session.user.user_id,
    setCurrentPosts,
    currentPosts.length,
  ]);

  const isOnlyCurrentUsersPosts = useMemo(
    () => currentPosts.every((post) => post.user_id === session.user.user_id),
    [currentPosts, session.user.user_id]
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="30vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="30vh"
      >
        <div>Something went wrong. Please try again later.</div>
      </Box>
    );
  }

  return (
    <Box sx={{ marginBottom: "60px", px: { xs: 2, md: 4 } }}>
      <SessionProvider session={session}>
        {showNewPost && (
          <NewPost posts={currentPosts} setPosts={setCurrentPosts} />
        )}
        {isOnlyCurrentUsersPosts && <EmptyFeed loading={loading} />}
        {currentPosts.map((post) => (
          <Post
            key={post.post_id}
            id={post.post_id}
            date={new Date(post.postdate + "Z")}
            content={post.text}
            imagePath={post.imageBlobUrl}
            {...post}
            onDelete={() => {
              if (session.user.user_id === post.user_id) {
                setCurrentPosts(
                  currentPosts.filter((p) => p.post_id !== post.post_id)
                );
              }
            }}
          />
        ))}
      </SessionProvider>
    </Box>
  );
}
