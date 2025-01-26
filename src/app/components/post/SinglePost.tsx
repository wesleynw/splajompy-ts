"use client";

import { useSinglePost } from "@/app/data/post";
import { renderMentions } from "@/app/utils/mentions";
import { User } from "@/db/schema";
import { Box, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Linkify from "linkify-react";
import Link from "next/link";
import React, { useState } from "react";
import CommentList from "../comment/CommentList";
import FollowButton from "../follows/FollowButton";
import Spinner from "../loading/Spinner";
import ImageModal from "./images/ImageModal";
import ResponsiveImage from "./images/ResponsiveImage";
import LikeButton from "./LikeButton";
import PostDropdown from "./PostDropdown";
import ShareButton from "./ShareButton";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type Props = {
  post_id: number;
  user: User;
};

export default function SinglePost({ post_id, user }: Readonly<Props>) {
  const { isPending, post, toggleLiked } = useSinglePost(post_id);
  const userTimezone = dayjs.tz.guess();

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const options = { defaultProtocol: "https", target: "_blank" };

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
        maxWidth: 600,
        margin: "6px auto",
        padding: 3,
        marginBottom: 10,
        borderRadius: "8px",
        backgroundColor: "background.paper",
        background: "linear-gradient(135deg, #1b1b1b, #222222)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        sx={{ marginBottom: 2 }}
      >
        <Link href={`/user/${post.poster}`}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 800,
              color: "white",
              alignSelf: "flex-end",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            @{post.poster}
          </Typography>
        </Link>
        <Stack direction="row">
          <ShareButton />
          {user.user_id === post.user_id ? (
            <PostDropdown post_id={post.post_id} />
          ) : (
            <FollowButton user_id={post.user_id} show_unfollow={false} />
          )}
        </Stack>
      </Stack>

      <Typography
        variant="h6"
        sx={{
          color: "white",
          fontWeight: "bold",
          marginBottom: 2,
          whiteSpace: "pre-line",
          overflowWrap: "break-word",
          "& a": {
            color: "lightblue",
            textDecoration: "underline",
          },
          "& a:hover": {
            cursor: "pointer",
          },
        }}
      >
        <Linkify options={options}>
          {post.text ? renderMentions(post.text) : ""}
        </Linkify>
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
            color: "white",
            marginBottom: 1,
          }}
        >
          {dayjs.utc(post.postdate).tz(userTimezone).fromNow()}
        </Typography>

        <LikeButton
          post_id={post.post_id}
          liked={post.liked}
          toggleLike={() => toggleLiked()}
        />
      </Box>

      <CommentList poster_id={post.user_id} post_id={post.post_id} />
    </Box>
  );
}
