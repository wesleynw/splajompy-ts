"use client";

import { User } from "@/db/schema";
import { CaretLeft as CaretLeftIcon } from "@phosphor-icons/react/dist/ssr";
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
      <CaretLeftIcon size={23} weight="fill" />
      <p className="ml-1 hidden font-black sm:block">Back</p>
    </button>
  );
}
