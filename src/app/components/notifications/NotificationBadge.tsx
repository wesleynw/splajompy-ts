import { getUnreadNotificationCountForUser } from "@/app/lib/notifications";
import { Badge } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";

export default function NotificationBadge({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { data: session, status } = useSession();
  const user_id = session?.user?.user_id;

  const { data } = useQuery({
    queryKey: ["notifications", user_id],
    queryFn: () => getUnreadNotificationCountForUser(user_id!),
    enabled: !!user_id,
  });

  if (status === "loading") {
    return <>{children}</>;
  }

  if (!user_id) {
    return <>{children}</>;
  }

  console.log("notification data: ", data);

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
