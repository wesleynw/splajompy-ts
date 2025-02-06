"use client";

import { useSinglePost } from "@/app/data/post";
import { PublicUser } from "@/db/schema";
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
  user: PublicUser;
  post_id: number;
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

  console.log("post: ", post);

  return (
    <Box sx={{ px: { xs: 1, md: 3 }, marginBottom: "75px" }}>
      <Post user={user} toggleLiked={toggleLiked} standaloneView {...post} />
    </Box>
  );
}
