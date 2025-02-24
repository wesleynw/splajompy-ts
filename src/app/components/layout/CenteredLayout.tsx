import React, { ReactNode } from "react";

export default function CenteredLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex w-full max-w-screen-sm flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
