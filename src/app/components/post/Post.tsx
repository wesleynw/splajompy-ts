"use client";

import { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  useTheme,
  Modal,
  IconButton,
} from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Link from "next/link";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  id: number;
  date: Date;
  content: string;
  poster: string;
  comment_count: number;
  imageUrl: string | null;
}

export default function Post({
  id,
  date,
  content,
  poster,
  comment_count,
  imageUrl,
}: Readonly<Props>) {
  const userTimezone = dayjs.tz.guess();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const imagePath = `https://splajompy-bucket.nyc3.cdn.digitaloceanspaces.com/${imageUrl}`;

  return (
    <>
      <Link href={`/post/${id}`}>
        <Box
          sx={{
            maxWidth: 600,
            padding: 2,
            margin: "16px auto",
            borderRadius: "8px",
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

          <Typography
            variant="body1"
            sx={{
              color: "#333333",
              fontWeight: "bold",
              marginBottom: 1,
              ...theme.applyStyles("dark", { color: "#ffffff" }),
            }}
          >
            {content}
          </Typography>
          {imageUrl && (
            <Image
              src={imagePath}
              alt="post image"
              width={0}
              height={0}
              sizes="100vw"
              style={{
                width: "100%",
                height: "auto",
                cursor: "pointer",
                maxHeight: "500px",
              }}
              onClick={(e) => {
                e.preventDefault();
                handleOpen();
              }}
            />
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

      {imageUrl && (
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              position: "relative",
              outline: "none",
            }}
          >
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                color: "white",
              }}
            >
              <CloseIcon />
            </IconButton>

            <Image
              src={imagePath}
              alt="Fullscreen post image"
              width={0}
              height={0}
              sizes="100vw"
              style={{
                width: "auto",
                height: "90%",
                maxWidth: "90%",
                objectFit: "contain",
              }}
            />
          </Box>
        </Modal>
      )}
    </>
  );
}
