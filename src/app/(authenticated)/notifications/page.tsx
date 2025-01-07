import React from "react";
import NotificationsView from "@/app/components/notifications/NotificationView";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/app/auth/session";

export default async function Notifications() {
  const { user } = await getCurrentSession();
  if (user === null) {
    redirect("/login");
  }

  return <NotificationsView />;
}
