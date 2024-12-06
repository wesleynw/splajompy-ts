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
import { useEffect } from "react";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export default function NotificationView({
  session,
  notifications,
}: Readonly<{ session: Session; notifications: SelectNotification[] }>) {
  const userTimezone = dayjs.tz.guess();

  // 2 seconds after loading this component, mark all notifications as read
  useEffect(() => {
    // Only run this code in the client, 2 seconds after the component mounts
    const timer = setTimeout(async () => {
      try {
        // Make a client-side request to an API endpoint that marks notifications as viewed
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
                background: "#fff",
                boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s",
                "&:hover": {
                  background: "#f7f7f7",
                },
                ...theme.applyStyles("dark", {
                  background: "#2a2a2a",
                  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.5)",
                  "&:hover": {
                    background: "#333",
                  },
                }),
                border: notification.viewed ? "none" : "2px solid #fff",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "#555",
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
