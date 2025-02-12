"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ExtendedNotificationData,
  fetchNotifications,
  markAllNotificationAsRead,
  markNotificationAsRead,
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

  const markAllReadMutation = useMutation({
    mutationFn: () => markAllNotificationAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      const previousNotifications = queryClient.getQueryData<{
        pages: ExtendedNotificationData[][];
      }>(["notifications"]);

      if (previousNotifications) {
        queryClient.setQueryData(["notifications"], {
          ...previousNotifications,
          pages: previousNotifications.pages.map((page) =>
            page.map((notification) => ({
              ...notification,
              viewed: true,
            })),
          ),
        });
      }

      queryClient.setQueryData(["has-unread-notifications"], false);

      return { previousNotifications };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markSingleRead = useMutation({
    mutationFn: (notification_id: number) =>
      markNotificationAsRead(notification_id),
    onMutate: async (notification_id) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      const previousNotifications = queryClient.getQueryData<{
        pages: ExtendedNotificationData[][];
      }>(["notifications"]);
      if (previousNotifications) {
        queryClient.setQueryData(["notifications"], {
          ...previousNotifications,
          pages: previousNotifications.pages.map((page) =>
            page.map((notification) =>
              notification.notification_id === notification_id
                ? { ...notification, viewed: true }
                : notification,
            ),
          ),
        });
      }

      queryClient.invalidateQueries({ queryKey: ["has-unread-notifications"] });

      return { previousNotifications };
    },
  });

  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    markRead: markAllReadMutation.mutate,
    markSingleRead: markSingleRead.mutate,
  };
}
