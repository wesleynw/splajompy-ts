import { getUnreadNotificationCountForUser } from "@/app/lib/notifications";
import { Badge } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";

export default function NotificationBadge({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { data: session } = useSession();
  const user_id = session?.user?.user_id;

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => {
      if (user_id) {
        getUnreadNotificationCountForUser(user_id);
      }
      return null;
    },
  });

  if (!user_id) {
    return children;
  }

  return (
    <Badge
      badgeContent={data}
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
