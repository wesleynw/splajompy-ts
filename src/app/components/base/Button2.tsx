import { ButtonHTMLAttributes, ReactNode } from "react";

export default function Button2({
  children,
  variant = "normal",
  ...props
}: Readonly<
  {
    children: ReactNode;
    variant?: "normal" | "outlined";
  } & ButtonHTMLAttributes<HTMLButtonElement>
>) {
  const normalClasses =
    "m-3 w-full rounded-sm bg-blue-400 px-2.5 py-2 font-bold overflow-auto";
  const outlineClasses =
    "m-3 w-full rounded-sm  px-2.5 py-2 font-bold border-1 border-neutral-800 overflow-auto";

  return (
    <button
      {...props}
      className={variant == "normal" ? normalClasses : outlineClasses}
    >
      {children}
    </button>
  );
}
