"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotifications,
  markAllNotificationAsRead,
} from "../lib/notifications";

const fetcher = async ({ pageParam }: { pageParam: number }) => {
  return fetchNotifications(pageParam);
};

export function useNotifications() {
  const queryClient = useQueryClient();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: fetcher,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === 10 ? pages.length * 10 : null;
    },
  });

  const markRead = async () => {
    await markAllNotificationAsRead();

    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["has-unread-notifications"] });
  };

  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    markRead,
  };
}
