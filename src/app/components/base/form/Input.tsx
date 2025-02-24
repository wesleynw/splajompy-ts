import React, { InputHTMLAttributes } from "react";

export default function Input({
  ...props
}: Readonly<InputHTMLAttributes<HTMLInputElement>>) {
  return (
    <div className="m-2 w-full rounded-md focus-within:outline-1 focus-within:outline-neutral-600">
      <input
        {...props}
        className="border-0.5 w-full rounded-md border-neutral-700 bg-neutral-900 p-2.5 focus:outline-none"
      />
    </div>
  );
}
