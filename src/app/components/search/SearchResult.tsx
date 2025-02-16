"use client";

import { PublicUser } from "@/db/schema";
import Link from "next/link";

type Props = {
  user: PublicUser;
};

export default function SearchResult({ user }: Readonly<Props>) {
  return (
    <Link href={`/user/${user.username}`} className="w-full">
      <div className="m-1.5 w-full rounded-md bg-neutral-700 p-2.5">
        <p className="font-bold">@{user.username}</p>
      </div>
    </Link>
  );
}
