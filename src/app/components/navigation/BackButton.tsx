"use client";

import { User } from "@/db/schema";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  user: User;
};

export default function BackButton({ user }: Readonly<Props>) {
  const router = useRouter();
  const path = usePathname();

  const username = user.username ?? "";

  const needsBackButton = !new RegExp(
    `^(/|/all|/notifications|/user/${username}|/search)$`,
  ).test(path);

  if (!needsBackButton) {
    return null;
  }

  return (
    <button
      onClick={() => {
        if (window.history?.length && window.history.length > 1) {
          router.back();
        } else {
          router.push("/");
        }
      }}
      className="ml-3 flex h-full flex-row justify-center align-middle"
    >
      <ArrowLeftIcon className="size-6 h-full" />
      <p className="ml-3 hidden h-full font-black sm:block">Back</p>
    </button>
  );
}
