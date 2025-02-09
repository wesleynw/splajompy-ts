"use client";

import { useNotifications } from "@/app/data/notifications";
import CenteredLayout from "../layout/CenteredLayout";
import Spinner from "../loading/Spinner";
import Notification from "./Notification";

export default function NotificationList() {
  const { isPending, notifications } = useNotifications();

  if (isPending) {
    return <Spinner />;
  }

  if (!notifications || notifications.length === 0) {
    return (
      <CenteredLayout>
        <p className="mt-10 text-xl font-bold">No notifications yet.</p>
      </CenteredLayout>
    );
  }

  return (
    <CenteredLayout>
      {notifications.map((notification) => (
        <Notification
          key={notification.notification_id}
          notificationData={notification}
        />
      ))}
    </CenteredLayout>
  );
}
