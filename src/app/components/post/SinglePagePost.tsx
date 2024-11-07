"use client";

import { Box, Stack, Typography, Button, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Suspense } from "react";
import CommentList from "./comment/CommentList";
import { SelectPost, SelectUser } from "@/db/schema";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  post: SelectUser & SelectPost;
}

export default function Page({ post }: Readonly<Props>) {
  const router = useRouter();
  const theme = useTheme();
  const userTimezone = dayjs.tz.guess();

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "32px auto",
        padding: 3,
        borderRadius: "12px",
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
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{
            color: theme.palette.text.secondary,
            textTransform: "none",
          }}
        >
          Back
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <MoreHorizIcon sx={{ color: theme.palette.text.secondary }} />
      </Stack>

      <Typography
        variant="body2"
        sx={{
          color: theme.palette.text.secondary,
          marginBottom: 1,
        }}
      >
        {dayjs.utc(post.postdate).tz(userTimezone).fromNow()}
      </Typography>

      <Typography
        variant="h6"
        sx={{
          color: theme.palette.text.primary,
          fontWeight: "bold",
          marginBottom: 2,
        }}
      >
        {post.text}
      </Typography>

      <Typography
        variant="subtitle2"
        sx={{
          color: theme.palette.text.secondary,
          alignSelf: "flex-end",
        }}
      >
        - {post.username}
      </Typography>

      <Suspense fallback={<div>Loading...</div>}>
        <CommentList post_id={post.post_id} />
      </Suspense>
    </Box>
  );
}
