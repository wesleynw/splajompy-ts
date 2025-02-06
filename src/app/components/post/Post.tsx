import { EnhancedPost } from "@/app/lib/posts";
import { PublicUser } from "@/db/schema";
import { Box, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import CommentCount from "../comment/CommentCount";
import CommentList from "../comment/CommentList";
import FollowButton from "../follows/FollowButton";
import ImageModal from "./images/ImageModal";
import ResponsiveImage from "./images/ResponsiveImage";
import LikeButton from "./LikeButton";
import OtherLikes from "./OtherLikes";
import PostDropdown from "./PostDropdown";
import PostTextContent from "./PostTextContent";
import ShareButton from "./ShareButton";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type Props = EnhancedPost & {
  user: PublicUser;
  toggleLiked: () => void;
  standaloneView?: boolean;
};

export default function Post({
  post_id,
  user,
  user_id,
  author,
  date,
  text,
  image_blob_url,
  image_width,
  image_height,
  comment_count,
  relevant_likes,
  liked,
  toggleLiked,
  standaloneView = false,
}: Readonly<Props>) {
  const router = useRouter();
  const userTimezone = dayjs.tz.guess();

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  return (
    <Box
      sx={{
        borderRadius: "8px",
        margin: "10px auto",
        width: "100%",
        maxWidth: 600,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        transition: "background-color 0.3s",
        background: "#1b1b1b",
        "&:hover": !standaloneView
          ? {
              background: "#222222",
              cursor: "pointer",
            }
          : {},
      }}
      onClick={() => router.push(`/post/${post_id}`)}
    >
      <Box sx={{ position: "relative" }}>
        <Box sx={{ position: "absolute", top: "10%", right: "0%" }}>
          {user.user_id === user_id ? (
            <PostDropdown post_id={post_id} />
          ) : (
            standaloneView && (
              <FollowButton user_id={user_id} show_unfollow={false} />
            )
          )}
        </Box>
      </Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography
          sx={{
            fontSize: "12pt",
            fontWeight: 800,
            color: "#b0b0b0",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push(`/user/${author}`);
          }}
        >
          @{author}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
      </Stack>

      <PostTextContent text={text} />

      {image_blob_url && image_height && image_width && (
        <Box>
          <ResponsiveImage
            imagePath={image_blob_url}
            width={image_width}
            height={image_height}
            setOpen={setOpen}
          />
          <ImageModal
            imagePath={image_blob_url}
            imageWidth={image_width}
            imageHeight={image_height}
            open={open}
            handleClose={handleClose}
          />
        </Box>
      )}

      <Stack direction="row" justifyContent="center" alignContent="center">
        <Typography
          variant="body2"
          sx={{
            color: "#e0e0e0",
            fontWeight: 700,
            alignContent: "center",
          }}
        >
          {dayjs.utc(date).tz(userTimezone).fromNow()}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {standaloneView && <ShareButton />}
        <Box sx={{ width: "20px" }}></Box>
        <CommentCount count={comment_count} />
        <LikeButton liked={liked} toggleLike={toggleLiked} />
      </Stack>

      <OtherLikes relevant_likes={relevant_likes} />

      {standaloneView && <CommentList post_id={post_id} user={user} />}
    </Box>
  );
}
