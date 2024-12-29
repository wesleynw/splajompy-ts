"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getNotifications,
  markAllNotificationAsRead,
} from "../lib/notifications";

export function useNotifications() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const markRead = async () => {
    await markAllNotificationAsRead();
  };

  return {
    isPending,
    isError,
    notifications: data,
    error,
    markRead,
  };
}
