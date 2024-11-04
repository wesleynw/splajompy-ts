"use client";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  date: Date;
  content: string;
  poster: string;
}

export default function Post({ date, content, poster }: Props) {
  const userTimezone = dayjs.tz.guess();
  const theme = useTheme();

  return (
    <Box
      sx={{
        maxWidth: 500,
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
      <Stack direction="row" alignItems="center">
        <Typography
          variant="body2"
          sx={{
            color: "#555555",
            ...theme.applyStyles("dark", { color: "#e0e0e0" }),
          }}
        >
          {dayjs.utc(date).tz(userTimezone).fromNow()}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <MoreHorizIcon
          sx={{
            color: "#555555",
            ...theme.applyStyles("dark", { color: "#e0e0e0" }),
          }}
        />
      </Stack>

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
      <Typography
        variant="subtitle2"
        sx={{
          color: "#777777",
          alignSelf: "flex-end",
          ...theme.applyStyles("dark", { color: "#b0b0b0" }),
        }}
      >
        - {poster}
      </Typography>
    </Box>
  );
}
