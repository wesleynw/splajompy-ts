import React, { ReactNode } from "react";

export default function CenteredLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="mt-1.5 flex w-full items-center justify-center px-2.5">
      <div className="flex w-full max-w-screen-sm flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
