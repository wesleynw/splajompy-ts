import { getCurrentSession } from "@/app/auth/session";
import NotificationsList from "@/app/components/notifications/NotificationList";
import { redirect } from "next/navigation";
import React from "react";

export default async function Notifications() {
  const { user } = await getCurrentSession();
  if (user === null) {
    redirect("/login");
  }

  return <NotificationsList />;
}
