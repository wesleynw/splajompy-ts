"use client";

import { User } from "@/db/schema";
import { useEffect, useRef } from "react";
import { RichTextareaHandle } from "rich-textarea";
import NewPost from "./NewPost";

type Props = {
  user: User;
  open: boolean;
  toggleOpen: () => void;
};

export default function NewPostDialog({
  user,
  open,
  toggleOpen,
}: Readonly<Props>) {
  const inputRef = useRef<RichTextareaHandle>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      const timeoutId = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="relative z-1">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={toggleOpen}
      />

      <div className="fixed inset-0 top-[60px] overflow-y-auto">
        <div className="flex min-h-full items-start justify-center">
          <div
            ref={dialogRef}
            className="animate-slide-down w-full transform bg-transparent transition-all duration-300"
          >
            <div className="top-5 h-full w-full p-0">
              <NewPost user={user} onPost={toggleOpen} inputRef={inputRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
