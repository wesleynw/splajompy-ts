"use client";

import React, { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Link from "next/link";
import ResponsiveImage from "./images/ResponsiveImage";
import ImageModal from "./images/ImageModal";
import PostDropdown from "./PostDropdown";
import theme from "@/theme";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LikeButton from "./LikeButton";
import { PostType } from "@/app/data/FeedProvider";
import CommentCount from "./comment/CommentCount";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  id: number;
  date: Date;
  content: string | null;
  user_id: number;
  poster: string;
  comment_count: number;
  imagePath: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  likedByCurrentUser: boolean;
  onDelete?: () => void;
  updateParentContext?: (updatedAttributes: Partial<PostType>) => void;
}

export default function Post({
  id,
  date,
  content,
  user_id,
  poster,
  comment_count,
  imagePath,
  imageWidth,
  imageHeight,
  likedByCurrentUser,
  onDelete,
  updateParentContext,
}: Readonly<Props>) {
  const router = useRouter();
  const userTimezone = dayjs.tz.guess();

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const { data: session } = useSession();

  return (
    <Link href={`/post/${id}`}>
      <Box
        sx={{
          borderRadius: "8px",
          margin: "10px auto",
          maxWidth: 600,
          padding: 3,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          transition: "background-color 0.3s",
          background: "linear-gradient(135deg, #ffffff, #f0f0f0)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
          "&:hover": {
            background: "linear-gradient(135deg, #f0f0f0, #e0e0e0)",
          },
          ...theme.applyStyles("dark", {
            background: "linear-gradient(135deg, #1b1b1b, #222222)",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
            "&:hover": {
              background: "linear-gradient(135deg, #222222, #2a2a2a)",
            },
          }),
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            variant="subtitle2"
            sx={{
              color: "#777777",
              ...theme.applyStyles("dark", { color: "#b0b0b0" }),
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            onClick={(e) => {
              e.preventDefault();
              router.push(`/user/${poster}`);
            }}
          >
            @{poster}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {session?.user?.user_id == user_id && onDelete && (
            <PostDropdown post_id={id} onDelete={onDelete} />
          )}
        </Stack>

        {content && (
          <Typography
            variant="body1"
            sx={{
              color: "#333333",
              fontWeight: "bold",
              marginBottom: 3,
              ...theme.applyStyles("dark", { color: "#ffffff" }),
            }}
          >
            {content.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </Typography>
        )}

        {imagePath && imageHeight && imageWidth && (
          <>
            <ResponsiveImage
              imagePath={imagePath}
              width={imageWidth}
              height={imageHeight}
              setOpen={setOpen}
            />
            <ImageModal
              imagePath={imagePath}
              imageWidth={imageWidth}
              imageHeight={imageHeight}
              open={open}
              handleClose={handleClose}
            />
          </>
        )}

        <Stack direction="row" alignItems="center">
          <CommentCount count={comment_count} />

          <Box sx={{ flexGrow: 1 }} />

          <Typography
            variant="body2"
            sx={{
              color: "#555555",
              ...theme.applyStyles("dark", { color: "#e0e0e0" }),
            }}
          >
            {dayjs.utc(date).tz(userTimezone).fromNow()}
          </Typography>
          {session?.user?.user_id && (
            <LikeButton
              post_id={id}
              poster_id={user_id}
              user_id={session?.user?.user_id}
              username={session?.user?.username}
              liked={likedByCurrentUser}
              setLiked={(liked) => {
                if (updateParentContext) {
                  updateParentContext({ liked: liked });
                }
              }}
            />
          )}
        </Stack>
      </Box>
    </Link>
  );
}
