"use client";

import { SelectNotification } from "@/db/schema";
import theme from "@/theme";
import { Box, Typography, Stack } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { setNotificationAsViewedForUser } from "@/app/lib/notifications";
import { Session } from "next-auth";
import Link from "next/link";
import { use, useEffect } from "react";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export default function NotificationView({
  session,
  notificationsPromise,
}: Readonly<{
  session: Session;
  notificationsPromise: Promise<SelectNotification[]>;
}>) {
  const userTimezone = dayjs.tz.guess();
  const notifications = use(notificationsPromise);

  // 2 seconds after loading this component, mark all notifications as read
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        await setNotificationAsViewedForUser(session.user.user_id);
      } catch (error) {
        console.error("Failed to mark notifications as viewed:", error);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [session.user.user_id]);

  if (notifications.length === 0) {
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
          <Link
            key={notification.notification_id}
            href={notification.link ?? ""}
          >
            <Box
              key={notification.notification_id}
              sx={{
                padding: 2,
                borderRadius: "6px",
                background: notification.viewed
                  ? "linear-gradient(135deg, #ffcccc, #ffeeee)"
                  : "linear-gradient(135deg, #ff0000, #ffcccc)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s",
                "&:hover": {
                  background: notification.viewed ? "#ffe6e6" : "#ff6666",
                },
                ...theme.applyStyles("dark", {
                  background: notification.viewed
                    ? "linear-gradient(135deg, #800000, #660000)"
                    : "linear-gradient(135deg, #990000, #770000)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
                  "&:hover": {
                    background: notification.viewed ? "#880000" : "#aa0000",
                  },
                }),
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "#333",
                  ...theme.applyStyles("dark", { color: "#ddd" }),
                }}
              >
                {notification.message}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  marginTop: 1,
                  color: "#888",
                  ...theme.applyStyles("dark", { color: "#bbb" }),
                }}
              >
                {dayjs.utc(notification.created_at).tz(userTimezone).fromNow()}
              </Typography>
            </Box>
          </Link>
        ))}
      </Stack>
    </Box>
  );
}
