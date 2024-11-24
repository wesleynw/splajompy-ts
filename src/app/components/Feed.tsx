"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import Post from "./post/Post";
import { getAllPosts, getAllPostsForFollowing } from "../lib/posts";
import { SessionProvider } from "next-auth/react";
import NewPost from "./post/NewPost/NewPost";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

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
}: Readonly<{ session: Session; fetchAllPosts: boolean }>) {
  const theme = useTheme();
  const router = useRouter();

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

  return (
    <Box>
      <SessionProvider session={session}>
        <NewPost posts={posts} setPosts={setPosts} />
        {posts.length == 0 && (
          <Box
            maxWidth="600px"
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{ margin: "0 auto", padding: 4 }}
          >
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                marginTop: 4,
                color: "#777777",
                paddingBottom: 2,
              }}
            >
              Nobody you follow has posted anything yet.
            </Typography>
            <Button
              onClick={() => router.push("/all")}
              variant="contained"
              size="medium"
              disabled={loading}
              sx={{
                textTransform: "none",
                borderRadius: "20px",
                paddingX: 2,
                paddingY: 0.5,
                fontWeight: "bold",
                fontSize: "0.875rem",
                minWidth: "auto",
                backgroundColor: "#1DA1F2",
                color: "#ffffff",
                ...theme.applyStyles("dark", {
                  backgroundColor: "#1DA1F2",
                }),
                "&:hover": {
                  backgroundColor: "#0d8de6",
                },
              }}
            >
              See all posts
            </Button>
          </Box>
        )}
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
