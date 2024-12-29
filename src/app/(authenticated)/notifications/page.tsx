import React, { Suspense } from "react";
import { auth } from "@/auth";
import NotificationsView from "@/app/components/notifications/NotificationView";
import NotificationsPageSkeleton from "@/app/components/loading/NotificationsPageSkeleton";
import StandardWrapper from "@/app/components/loading/StandardWrapper";
import { redirect } from "next/navigation";

export default async function Notifications() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Suspense
      fallback={
        <StandardWrapper>
          <NotificationsPageSkeleton />
        </StandardWrapper>
      }
    >
      <NotificationsView />
    </Suspense>
  );
}
