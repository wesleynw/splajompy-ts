"use client";

import { User } from "@/db/schema";
import Link from "next/link";
import { useState } from "react";
import NewPostButton from "../post/new/NewPostButton";
import NewPostDialog from "../post/new/NewPostDialog";
import DownloadPrompt from "../pwa/DownloadPrompt";
import BackButton from "./BackButton";

type Props = {
  user: User;
};

export default function TopBar({ user }: Readonly<Props>) {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen((prev) => {
      return !prev;
    });
  };

  return (
    <>
      <div className="fixed top-0 z-10 w-full border-b-1 border-neutral-700 py-2.5 backdrop-blur-xl">
        <div className="flex h-full flex-row justify-center">
          <div className="fixed left-0 flex flex-row">
            <BackButton user={user} />
            <DownloadPrompt />
          </div>
          <Link href="/">
            <p className="text-2xl font-black">Splajompy</p>
          </Link>
          <div className="fixed right-3 z-50">
            <NewPostButton isOpen={open} toggleOpen={toggleOpen} />
          </div>
        </div>
      </div>
      <NewPostDialog user={user} open={open} toggleOpen={toggleOpen} />
    </>
  );
}
