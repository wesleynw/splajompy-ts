"use client";

import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  useTheme,
  Button,
  CircularProgress,
} from "@mui/material";
import Post from "../post/Post";
import BackButton from "../navigation/BackButton";
import { signOut, useSession } from "next-auth/react";
import { PostData } from "@/app/lib/posts";
import FollowButton from "../follows/FollowButton";
import { useFeed } from "@/app/data/FeedProvider";

interface AccountViewProps {
  user: {
    user_id: number;
    email: string;
    password: string;
    username: string;
  };
}

export default function AccountView({ user }: Readonly<AccountViewProps>) {
  const { posts, fetchFeed, deletePostFromFeed, updatePost, loading, error } =
    useFeed();
  const { data: session } = useSession();
  const theme = useTheme();

  const isOwnProfile = session?.user?.user_id === user.user_id;

  useEffect(() => {
    if (posts.length === 0) {
      fetchFeed(false);
    }
  }, [
    fetchFeed,
    posts.length,
    session?.user?.user_id,
    user.user_id,
    isOwnProfile,
  ]);

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
    <Box sx={{ px: { xs: 2, md: 4 } }}>
      <Box
        sx={{
          maxWidth: 600,
          borderRadius: "8px",
          padding: 3,
          background: "linear-gradient(135deg, #ffffff, #f9f9f9)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          margin: "10px auto",
          ...theme.applyStyles("dark", {
            background: "linear-gradient(135deg, #1b1b1b, #2a2a2a)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
          }),
        }}
      >
        <Box display="flex" justifyContent="space-between">
          <BackButton />
          {isOwnProfile && (
            <Button
              variant="contained"
              size="medium"
              onClick={() => {
                signOut();
              }}
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
              Sign Out
            </Button>
          )}
          <FollowButton user_id={user.user_id} show_unfollow={true} />
        </Box>
        <Stack
          direction="row"
          alignItems="left"
          justifyContent="space-between"
          marginTop={1}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#333333",
              wordBreak: "break-all",
              textAlign: "center",
              marginLeft: 1,
              ...theme.applyStyles("dark", { color: "#ffffff" }),
            }}
          >
            @{user.username}
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ marginBottom: "100px" }}>
        {posts.length > 0 ? (
          posts
            .filter((post) => post.user_id == session?.user.user_id)
            .map((post) => (
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
                likedByCurrentUser={post.liked}
                updateParentContext={(updatedAttributes: Partial<PostData>) => {
                  updatePost(post.post_id, updatedAttributes);
                }}
                onDelete={() => {
                  deletePostFromFeed(post.post_id);
                }}
              />
            ))
        ) : (
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              marginTop: 4,
              color: "#777777",
              ...theme.applyStyles("dark", { color: "#b0b0b0" }),
            }}
          >
            {isOwnProfile
              ? "You haven't posted anything yet."
              : "This user hasn't posted anything yet."}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
