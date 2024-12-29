"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markAllNotificationAsRead,
} from "../lib/notifications";

export function useNotifications() {
  const queryClient = useQueryClient();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const markRead = async () => {
    await markAllNotificationAsRead();

    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["has-unread-notifications"] });
  };

  return {
    isPending,
    isError,
    notifications: data,
    error,
    markRead,
  };
}
