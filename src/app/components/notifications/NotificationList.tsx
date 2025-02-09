"use client";

import { useNotifications } from "@/app/data/notifications";
import ScrollObserver from "../feed/ScrollObserver";
import CenteredLayout from "../layout/CenteredLayout";
import Spinner from "../loading/Spinner";
import Notification from "./Notification";

export default function NotificationList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useNotifications();

  if (status === "pending") {
    return <Spinner />;
  }

  if (!data || data.pages.length === 0) {
    return (
      <CenteredLayout>
        <p className="mt-10 text-xl font-bold">No notifications yet.</p>
      </CenteredLayout>
    );
  }

  return (
    <CenteredLayout>
      {data.pages.map((page) =>
        page.map((notification) => (
          <Notification
            key={notification.notification_id}
            notificationData={notification}
          />
        )),
      )}
      <ScrollObserver
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </CenteredLayout>
  );
}
