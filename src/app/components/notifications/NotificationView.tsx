"use client";

import theme from "@/theme";
import { Box, Typography, Stack } from "@mui/material";
import Notification from "./Notification";
import { useNotifications } from "@/app/data/notifications";
import Spinner from "../loading/Spinner";
import { useEffect } from "react";

export default function NotificationView() {
  const { isPending, notifications, markRead } = useNotifications();

  useEffect(() => {
    const timer = setTimeout(async () => {
      await markRead();
    }, 1000);

    return () => clearTimeout(timer);
  }, [markRead]);

  if (isPending) {
    return <Spinner />;
  }

  if (!notifications || notifications.length === 0) {
    return (
      <Box
        sx={{
          maxWidth: 600,
          margin: "20px auto",
          padding: 3,
          borderRadius: "8px",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            color: "#777777",
            ...theme.applyStyles("dark", { color: "#bbb" }),
          }}
        >
          No notifications yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "20px auto",
        marginBottom: "100px",
        padding: 3,
        borderRadius: "8px",
      }}
    >
      <Stack spacing={2} sx={{ cursor: "pointer" }}>
        {notifications.map((notification) => (
          <Notification
            key={notification.notification_id}
            notification={notification}
          />
        ))}
      </Stack>
    </Box>
  );
}
