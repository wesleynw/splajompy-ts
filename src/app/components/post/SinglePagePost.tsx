"use client";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Suspense, useState } from "react";
import CommentList from "./comment/CommentList";
import BackButton from "../navigation/back-button";
import ResponsiveImage from "./images/ResponsiveImage";
import ImageModal from "./images/ImageModal";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  post_id: number;
  user_id: number;
  username: string;
  text: string | null;
  postdate: string;
  imagePath: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
}

export default function Page({
  post_id,
  username,
  text,
  postdate,
  imagePath,
  imageWidth,
  imageHeight,
}: Readonly<Props>) {
  const theme = useTheme();
  const userTimezone = dayjs.tz.guess();

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  return (
    <Box
      sx={{
        maxWidth: 600,
        // margin: "6px auto",
        padding: 3,
        // borderRadius: "12px",
        backgroundColor: "background.paper",
        background: "linear-gradient(135deg, #ffffff, #f5f5f5)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
        ...theme.applyStyles("dark", {
          background: "linear-gradient(135deg, #1b1b1b, #222222)",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
        }),
      }}
    >
      <Stack direction="row" alignItems="center" sx={{ marginBottom: 2 }}>
        <BackButton />
      </Stack>

      <Typography
        variant="subtitle2"
        sx={{
          color: theme.palette.text.secondary,
          alignSelf: "flex-end",
        }}
      >
        @{username}
      </Typography>

      <Typography
        variant="h6"
        sx={{
          color: theme.palette.text.primary,
          fontWeight: "bold",
          marginBottom: 2,
        }}
      >
        {text}
      </Typography>

      {imagePath && imageWidth && imageHeight && (
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

      <Typography
        variant="body2"
        sx={{
          color: theme.palette.text.secondary,
          marginBottom: 1,
        }}
      >
        {dayjs.utc(postdate).tz(userTimezone).fromNow()}
      </Typography>

      <Suspense fallback={<div>Loading...</div>}>
        <CommentList post_id={post_id} />
      </Suspense>
    </Box>
  );
}
