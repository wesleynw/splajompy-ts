import { PublicUser } from "@/db/schema";
import { Box, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import CommentCount from "../comment/CommentCount";
import ImageModal from "./images/ImageModal";
import ResponsiveImage from "./images/ResponsiveImage";
import LikeButton from "./LikeButton";
import PostDropdown from "./PostDropdown";
import PostTextContent from "./PostTextContent";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type Props = {
  id: number;
  user: PublicUser;
  user_id: number;
  author: string;
  date: Date;
  text: string | null;
  imageUrl: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  commentCount: number;
  liked: boolean;
  toggleLiked: () => void;
};

export default function Post({
  id,
  user,
  user_id,
  author,
  date,
  text,
  imageUrl,
  imageWidth,
  imageHeight,
  commentCount,
  liked,
  toggleLiked,
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
        padding: 3,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        transition: "background-color 0.3s",
        background: "linear-gradient(135deg, #1b1b1b, #222222)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
        "&:hover": {
          background: "linear-gradient(135deg, #222222, #2a2a2a)",
        },
      }}
      onClick={() => router.push(`/post/${id}`)}
    >
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
        {user.user_id == user_id && <PostDropdown post_id={id} />}
      </Stack>

      <PostTextContent text={text} />

      {imageUrl && imageHeight && imageWidth && (
        <Box>
          <ResponsiveImage
            imagePath={imageUrl}
            width={imageWidth}
            height={imageHeight}
            setOpen={setOpen}
          />
          <ImageModal
            imagePath={imageUrl}
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            open={open}
            handleClose={handleClose}
          />
        </Box>
      )}

      <Typography
        variant="body2"
        sx={{
          color: "#e0e0e0",
          fontWeight: 700,
        }}
      >
        {dayjs.utc(date).tz(userTimezone).fromNow()}
      </Typography>

      <Stack direction="row" alignItems="center">
        <CommentCount count={commentCount} />

        <Box sx={{ flexGrow: 1 }} />

        <LikeButton liked={liked} toggleLike={toggleLiked} />
      </Stack>
    </Box>
  );
}
