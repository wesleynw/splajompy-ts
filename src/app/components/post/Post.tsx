"use client";

import { useState } from "react";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Link from "next/link";
import ResponsiveImage from "./images/ResponsiveImage";
import ImageModal from "./images/ImageModal";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  id: number;
  date: Date;
  content: string | null;
  poster: string;
  comment_count: number;
  imagePath: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
}

export default function Post({
  id,
  date,
  content,
  poster,
  comment_count,
  imagePath,
  imageWidth,
  imageHeight,
}: Readonly<Props>) {
  const userTimezone = dayjs.tz.guess();
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Link href={`/post/${id}`}>
        <Box
          sx={{
            borderRadius: "8px",
            margin: "10px",
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
          <Typography
            variant="subtitle2"
            sx={{
              color: "#777777",
              ...theme.applyStyles("dark", { color: "#b0b0b0" }),
            }}
          >
            @{poster}
          </Typography>

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
              {content}
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
            <Typography
              variant="subtitle2"
              sx={{
                color: "#777777",
                fontSize: 14,
                ...theme.applyStyles("dark", { color: "#b0b0b0" }),
              }}
            >
              {comment_count} comment{comment_count === 1 ? "" : "s"}
            </Typography>

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
          </Stack>
        </Box>
      </Link>
    </>
  );
}
