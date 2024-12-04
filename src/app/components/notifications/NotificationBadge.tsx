import { getUnreadNotificationCountForUser } from "@/app/lib/notifications";
import { Badge } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";

export default function NotificationBadge({
  user_id,
  children,
}: Readonly<{ user_id: number; children: ReactNode }>) {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      const count = await getUnreadNotificationCountForUser(user_id);
      setNotificationCount(count);
    };

    fetchNotificationCount();
  });

  return <Badge badgeContent={notificationCount}>{children}</Badge>;
}
