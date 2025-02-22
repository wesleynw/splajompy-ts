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
      className="ml-3 flex items-center"
    >
      <ArrowLeftIcon className="h-6 w-6" />
      <p className="ml-3 hidden font-black sm:block">Back</p>
    </button>
  );
}
