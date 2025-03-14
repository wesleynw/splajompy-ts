"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  username: string;
};

export default function Prefetcher({ username }: Props) {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/all");
    router.prefetch("/search");
    router.prefetch("/notifications");
    router.prefetch(`/user/${username}`);
  }, [router, username]);

  return null;
}
