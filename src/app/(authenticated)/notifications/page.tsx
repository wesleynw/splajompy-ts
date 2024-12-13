import React, { Suspense } from "react";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { auth } from "@/auth";
import { getNotificationsForUser } from "@/app/lib/notifications";
import NotificationsView from "@/app/components/notifications/NotificationView";
import NotificationsPageSkeleton from "@/app/components/loading/NotificationsPageSkeleton";
import StandardWrapper from "@/app/components/loading/StandardWrapper";

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

  const notifications = getNotificationsForUser(session.user.user_id);

  return (
    <Suspense
      fallback={
        <StandardWrapper>
          <NotificationsPageSkeleton />
        </StandardWrapper>
      }
    >
      <NotificationsView
        session={session}
        notificationsPromise={notifications}
      />
    </Suspense>
  );
}
