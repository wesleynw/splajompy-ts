import { getCurrentUserHasUnreadNotifications } from "@/app/lib/notifications";
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
    <div className="relative">
      <div
        className={`${data ? "visible" : "invisible"} absolute -end-0.5 -top-0.5 inline-flex h-2 w-2 items-center justify-center rounded-full bg-blue-400 md:h-3 md:w-3`}
      >
        {data}
      </div>
      {children}
    </div>
  );
}
