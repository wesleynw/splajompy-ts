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
      console.log("1");
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      console.log("2");

      const previousNotifications = queryClient.getQueryData<{
        pages: ExtendedNotificationData[][];
      }>(["notifications"]);

      console.log("3");

      console.log(previousNotifications);

      if (previousNotifications) {
        console.log("4");

        queryClient.setQueryData(["notifications"], {
          ...previousNotifications,
          pages: previousNotifications.pages.map((page) =>
            page.map((notification) => ({
              ...notification,
              viewed: true,
            })),
          ),
        });

        console.log("4.5");
      }

      console.log("5");

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

  // const markRead = async () => {
  //   await markAllNotificationAsRead();

  //   queryClient.invalidateQueries({ queryKey: ["notifications"] });
  //   queryClient.invalidateQueries({ queryKey: ["has-unread-notifications"] });
  // };

  // const markSingleRead = async (notification_id: number) => {};

  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    markRead: markAllReadMutation.mutate,
  };
}
