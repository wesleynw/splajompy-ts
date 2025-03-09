"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserByUsername, updateCurrentUser } from "../lib/users";

export function useUser(username: string) {
  const { isPending, isError, data } = useQuery({
    queryKey: ["user", username],
    queryFn: () => getUserByUsername(username),
  });

  const mutateUser = useMutation({
    mutationFn: ({ name, bio }: { name: string; bio: string }) =>
      updateCurrentUser({ name, bio }),
    // onMutate: async ({ name, bio }: { name: string; bio: string }) => {
    //   console.log("TODO");
    // },
  });

  return { isPending, isError, user: data, mutate: mutateUser.mutate };
}
