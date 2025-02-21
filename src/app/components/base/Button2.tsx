import { ButtonHTMLAttributes, ReactNode } from "react";

export default function Button2({
  children,
  ...props
}: Readonly<
  { children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>
>) {
  return (
    <button
      {...props}
      className="m-3 w-full rounded-sm bg-blue-400 px-2.5 py-2 font-bold"
    >
      {children}
    </button>
  );
}
