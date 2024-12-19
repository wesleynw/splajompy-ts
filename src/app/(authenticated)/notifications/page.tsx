import React, { Suspense } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { auth } from "@/auth";
import { getNotificationsForUser } from "@/app/lib/notifications";
import NotificationsView from "@/app/components/notifications/NotificationView";
import NotificationsPageSkeleton from "@/app/components/loading/NotificationsPageSkeleton";
import StandardWrapper from "@/app/components/loading/StandardWrapper";
import { redirect } from "next/navigation";

dayjs.extend(relativeTime);

export default async function Notifications() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
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
