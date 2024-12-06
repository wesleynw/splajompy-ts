"use client";

import React, { Suspense, useState } from "react";
import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import BackButton from "../navigation/BackButton";
import ResponsiveImage from "./images/ResponsiveImage";
import ImageModal from "./images/ImageModal";
import PostDropdown from "./PostDropdown";
import { deletePost } from "@/app/lib/posts";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import FollowButton from "../follows/FollowButton";
import LikeButton from "./LikeButton";
import CommentList from "./comment/CommentList";
import { usePost } from "@/app/data/PostProvider";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export default function PostPageContent() {
  const theme = useTheme();
  const router = useRouter();
  const { post, updatePost, loading } = usePost();
  const { data: session } = useSession();
  const userTimezone = dayjs.tz.guess();

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

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

  if (!post) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="30vh"
      >
        <Typography variant="h6">Post not found.</Typography>
      </Box>
    );
  }

  const handleDelete = async () => {
    try {
      await deletePost(post.post_id);
      router.push("/");
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "6px auto",
        padding: 3,
        marginBottom: 10,
        borderRadius: "8px",
        backgroundColor: "background.paper",
        background: "linear-gradient(135deg, #ffffff, #f5f5f5)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
        ...theme.applyStyles("dark", {
          background: "linear-gradient(135deg, #1b1b1b, #222222)",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
        }),
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        sx={{ marginBottom: 2 }}
      >
        <BackButton />
        {session?.user.user_id === post.user_id ? (
          <PostDropdown post_id={post.post_id} onDelete={handleDelete} />
        ) : (
          <FollowButton user_id={post.user_id} show_unfollow={false} />
        )}
      </Stack>

      <Link href={`/user/${post.poster}`}>
        <Typography
          variant="subtitle2"
          sx={{
            color: theme.palette.text.secondary,
            alignSelf: "flex-end",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          @{post.poster}
        </Typography>
      </Link>

      <Typography
        variant="h6"
        sx={{
          color: theme.palette.text.primary,
          fontWeight: "bold",
          marginBottom: 2,
        }}
      >
        {post.text?.split("\n").map((line: string) => (
          <React.Fragment key={line.substring(0, 10)}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </Typography>

      {post.imageBlobUrl && post.imageWidth && post.imageHeight && (
        <>
          <ResponsiveImage
            imagePath={post.imageBlobUrl}
            width={post.imageWidth}
            height={post.imageHeight}
            setOpen={setOpen}
          />

          <ImageModal
            imagePath={post.imageBlobUrl}
            imageWidth={post.imageWidth}
            imageHeight={post.imageHeight}
            open={open}
            handleClose={handleClose}
          />
        </>
      )}

      <Box display="flex" justifyContent="space-between">
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            marginBottom: 1,
          }}
        >
          {dayjs.utc(post.postdate).tz(userTimezone).fromNow()}
        </Typography>

        {session?.user.user_id && (
          <LikeButton
            post_id={post.post_id}
            poster_id={post.user_id}
            user_id={session?.user.user_id}
            username={session?.user.username}
            liked={post.liked}
            setLiked={() => {
              updatePost({ liked: !post.liked });
            }}
          />
        )}
      </Box>

      <Suspense fallback={<div>Loading...</div>}>
        <CommentList
          poster={post.user_id}
          post_id={post.post_id}
          commentCount={post.comment_count}
          setCommentCount={() => {
            updatePost({ comment_count: post.comment_count + 1 });
          }}
        />
      </Suspense>
    </Box>
  );
}
