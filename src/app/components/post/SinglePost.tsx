"use client";

import { useSinglePost } from "@/app/data/post";
import { User } from "@/db/schema";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import React from "react";
import Spinner from "../loading/Spinner";
import Post from "./Post";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type Props = {
  post_id: number;
  user: User;
};

export default function SinglePost({ post_id, user }: Readonly<Props>) {
  const { isPending, post, toggleLiked } = useSinglePost(post_id);

  if (isPending) {
    return <Spinner />;
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

  return (
    <Box
      sx={{
        margin: "0px auto",
        borderRaius: "8px",
      }}
    >
      <Post
        id={post_id}
        user={user}
        author={post.poster}
        user_id={post.user_id}
        date={new Date(post.postdate)}
        text={post.text}
        liked={post.liked}
        commentCount={post.comment_count}
        imageUrl={post.imageBlobUrl}
        imageWidth={post.imageWidth}
        imageHeight={post.imageHeight}
        toggleLiked={toggleLiked}
        showComments
      />
    </Box>
  );
}
