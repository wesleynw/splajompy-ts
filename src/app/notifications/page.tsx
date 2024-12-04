import React from "react";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { auth } from "@/auth";
import { getNotificationsForUser } from "../lib/notifications";
import NotificationsView from "../components/notifications/NotificationView";
import Navigation from "../components/navigation/Navigation";

dayjs.extend(relativeTime);

export default async function Notifications() {
  const session = await auth();

  if (!session?.user) {
    return (
      <Box
        sx={{
          maxWidth: 600,
          margin: "auto",
          textAlign: "center",
          padding: 3,
          borderRadius: "8px",
          background: "linear-gradient(135deg, #ffffff, #f7f7f7)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#777",
          }}
        >
          Not logged in
        </Typography>
      </Box>
    );
  }

  const notifications = await getNotificationsForUser(session.user.user_id);
  return (
    <>
      <NotificationsView session={session} notifications={notifications} />
      <Navigation session={session} />
    </>
  );
}
