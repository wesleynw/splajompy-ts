import { getCurrentUserHasUnreadNotifications } from "@/app/lib/notifications";
import { Badge } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ReactNode } from "react";

export default function NotificationBadge({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { data, status } = useQuery({
    queryKey: ["has-unread-notifications"],
    queryFn: getCurrentUserHasUnreadNotifications,
  });

  if (status === "pending") {
    return <>{children}</>;
  }

  return (
    <Badge
      variant="dot"
      badgeContent=""
      color="info"
      overlap="circular"
      invisible={!data}
      sx={{
        "& .MuiBadge-badge": {
          position: "absolute",
          transform: "translate(50%, -50%)",
          zIndex: 1,
        },
      }}
    >
      {children}
    </Badge>
  );
}
