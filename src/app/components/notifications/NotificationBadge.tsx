import { getUnreadNotificationCountForUser } from "@/app/lib/notifications";
import { Badge } from "@mui/material";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";
import useSWR from "swr";

export default function NotificationBadge({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { data: session } = useSession();
  const user_id = session?.user?.user_id;

  const { data } = useSWR(
    user_id ? `notification-count-${user_id}` : null,
    () => {
      if (user_id) {
        return getUnreadNotificationCountForUser(user_id);
      }
      return 0;
    }
  );

  if (!user_id) {
    return children;
  }

  return <Badge badgeContent={data}>{children}</Badge>;
}
