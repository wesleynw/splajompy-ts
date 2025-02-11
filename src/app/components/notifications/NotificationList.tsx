"use client";

import { useNotifications } from "@/app/data/notifications";
import ScrollObserver from "../feed/ScrollObserver";
import CenteredLayout from "../layout/CenteredLayout";
import Spinner from "../loading/Spinner";
import MarkReadButton from "./MarkReadButton";
import Notification from "./Notification";

export default function NotificationList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    markRead,
  } = useNotifications();

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
      <div className="flex w-full flex-row justify-start">
        <MarkReadButton markRead={markRead} />
      </div>
      {data.pages.map((page) =>
        page.map((notification) => (
          <Notification
            key={notification.notification_id}
            notificationData={notification}
          />
        )),
      )}
      {isFetchingNextPage && <Spinner />}
      <ScrollObserver
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </CenteredLayout>
  );
}
