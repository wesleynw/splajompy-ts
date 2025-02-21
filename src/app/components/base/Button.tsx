import { ButtonHTMLAttributes, ReactNode } from "react";

export default function Button({
  children,
  ...props
}: Readonly<
  { children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>
>) {
  return (
    <button
      {...props}
      className="flex flex-row items-center justify-center rounded-full bg-blue-400 px-2.5 py-1 font-bold"
    >
      {children}
    </button>
  );
}
