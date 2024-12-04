"use client";

import { Box, CircularProgress } from "@mui/material";
import NewPost from "../post/NewPost/NewPost";
import EmptyFeed from "./EmptyFeed";
import { PostType, useFeed } from "../../data/FeedProvider";
import { SessionProvider, signOut } from "next-auth/react";
import { Session } from "next-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Post from "../post/Post";

export default function Feed({
  session,
  fetchAllPosts,
  showNewPost,
}: Readonly<{
  session: Session;
  fetchAllPosts: boolean;
  showNewPost: boolean;
}>) {
  const router = useRouter();
  const {
    posts,
    allPosts,
    loading,
    error,
    fetchFeed,
    insertPostToFeed,
    deletePostFromFeed,
    updatePost,
  } = useFeed();
  const currentPosts = fetchAllPosts ? allPosts : posts;

  useEffect(() => {
    if (!session.user.username) {
      signOut();
      router.push("/login");
    }

    const fetchPosts = async () => {
      await fetchFeed(fetchAllPosts);
    };

    fetchPosts();
  }, []);

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

  const isOnlyCurrentUsersPosts = currentPosts.every(
    (post) => post.user_id === session.user.user_id
  );

  return (
    <Box sx={{ marginBottom: "60px", px: { xs: 2, md: 4 } }}>
      <SessionProvider session={session}>
        {showNewPost && <NewPost insertPostToFeed={insertPostToFeed} />}
        {isOnlyCurrentUsersPosts && <EmptyFeed loading={loading} />}
        {currentPosts.map((post) => (
          <Post
            key={post.post_id}
            id={post.post_id}
            date={new Date(post.postdate + "Z")}
            content={post.text}
            imagePath={post.imageBlobUrl}
            {...post}
            likedByCurrentUser={post.liked}
            updateParentContext={(updatedAttributes: Partial<PostType>) => {
              updatePost(post.post_id, updatedAttributes);
            }}
            onDelete={() => deletePostFromFeed(post.post_id)}
          />
        ))}
      </SessionProvider>
    </Box>
  );
}
