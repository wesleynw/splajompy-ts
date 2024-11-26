"use client";

import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import Post from "../post/Post";
import { getAllPosts, getAllPostsForFollowing } from "../../lib/posts";
import { SessionProvider } from "next-auth/react";
import NewPost from "../post/NewPost/NewPost";
import { Session } from "next-auth";
import EmptyFeed from "./EmptyFeed";

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

export default function Feed({
  session,
  fetchAllPosts,
  showNewPost,
}: Readonly<{
  session: Session;
  fetchAllPosts: boolean;
  showNewPost: boolean;
}>) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const results = fetchAllPosts
          ? await getAllPosts()
          : await getAllPostsForFollowing(session.user.user_id);
        setPosts(results);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [fetchAllPosts, session.user.user_id]);

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
    return <div>Error loading posts.</div>;
  }

  // if all the posts are by the current user, show them the same message about going to the all posts page
  if (
    posts.length > 0 &&
    posts.every((post) => post.user_id === session.user.user_id)
  ) {
    return <EmptyFeed loading={loading} />;
  }

  return (
    <Box>
      <SessionProvider session={session}>
        {showNewPost && <NewPost posts={posts} setPosts={setPosts} />}
        {posts.length == 0 && <EmptyFeed loading={loading} />}
        {posts.map((post) => (
          <Post
            key={post.post_id}
            id={post.post_id}
            date={new Date(post.postdate + "Z")}
            content={post.text}
            user_id={post.user_id}
            poster={post.poster}
            comment_count={post.comment_count}
            imagePath={post.imageBlobUrl}
            imageWidth={post.imageWidth}
            imageHeight={post.imageHeight}
            onDelete={() => {
              if (session.user.user_id === post.user_id) {
                setPosts(posts.filter((p) => p.post_id !== post.post_id));
              }
            }}
          />
        ))}
      </SessionProvider>
    </Box>
  );
}
