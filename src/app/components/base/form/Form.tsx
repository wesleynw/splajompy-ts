import { FormHTMLAttributes, ReactNode } from "react";

export default function Form({
  children,
  ...props
}: Readonly<{ children: ReactNode } & FormHTMLAttributes<HTMLFormElement>>) {
  return (
    <form
      {...props}
      className="flex w-full flex-col items-center rounded-xl p-8 text-center"
    >
      {children}
    </form>
  );
}
