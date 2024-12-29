import React from "react";
import { auth } from "@/auth";
import NotificationsView from "@/app/components/notifications/NotificationView";
import { redirect } from "next/navigation";

export default async function Notifications() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <NotificationsView />;
}
