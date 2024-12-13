"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import StandardWrapper from "@/app/components/loading/StandardWrapper";
import FeedSkeleton from "@/app/components/loading/FeedSkeleton";

interface RequireAuthProps {
  children: ReactNode;
}

export default function RequireAuth({ children }: Readonly<RequireAuthProps>) {
  const router = useRouter();
  const { status } = useSession();

  if (status === "loading") {
    return (
      <StandardWrapper>
        <FeedSkeleton />
      </StandardWrapper>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return <>{children}</>;
}
