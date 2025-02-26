"use client";

import { PublicUser } from "@/db/schema";
import Link from "next/link";

type Props = {
  user: PublicUser;
};

export default function SearchResult({ user }: Readonly<Props>) {
  return (
    <Link href={`/user/${user.username}`} className="w-full">
      <div className="w-full border-y-1 border-neutral-700 p-3 sm:border-x-1">
        <p className="font-bold">@{user.username}</p>
      </div>
    </Link>
  );
}
