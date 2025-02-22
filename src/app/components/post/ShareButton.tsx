"use client";

import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function ShareButton() {
  const [open, setOpen] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (navigator.share && navigator.canShare({ url: window.location.href })) {
      try {
        await navigator.share({ url: window.location.href });
      } catch (error) {
        console.error("Sharing failed:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setOpen(true);
        setTimeout(() => setOpen(false), 3000);
      } catch (error) {
        console.error("Copy to clipboard failed:", error);
      }
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="rounded-full p-2 transition-colors duration-200 hover:bg-gray-100/10"
      >
        <ArrowUpOnSquareIcon className="h-6 w-6" />
      </button>
      <div
        className={`fixed bottom-14 left-1/2 z-50 -translate-x-1/2 transform rounded-lg bg-neutral-600 px-4 py-2 text-white transition-all duration-300 ease-in-out ${open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"} `}
        role="alert"
      >
        Link copied to clipboard
      </div>
    </>
  );
}
