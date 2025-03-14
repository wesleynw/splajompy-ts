import { cva, type VariantProps } from "cva";
import React, { ReactNode } from "react";

const button = cva(
  "m-3 py-1 px-2.5 font-bold transition-all select-none text-neutral-100",
  {
    variants: {
      color: {
        default: [
          "bg-blue-400",
          "hover:bg-blue-500",
          "border-1",
          "border-transparent",
        ],
        outline: [
          "border-1",
          "border-neutral-600",
          "bg-transparent",
          "hover:bg-neutral-800",
        ],
      },
      fullWidth: {
        true: ["w-full", "rounded-sm"],
        false: ["rounded-full"],
      },
      disabled: {
        true: [
          "bg-neutral-700",
          "text-neutral-500",
          "cursor-not-allowed",
          "hover:bg-neutral-700",
          "text-neutral-500",
        ],
        false: ["bg-blue-400", "hover:bg-blue-500"],
      },
    },
    compoundVariants: [
      {
        color: "outline",
        fullWidth: true,
        disabled: false,
        class: "active:bg-neutral-700",
      },
      {
        color: "default",
        fullWidth: true,
        disabled: false,
        class: "active:bg-blue-600",
      },
      { fullWidth: false, disabled: false, class: "active:scale-92" },
    ],
  },
);

export type Props = { children: ReactNode } & VariantProps<typeof button> &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">;

export default function Button({
  children,
  color = "default",
  fullWidth = false,
  disabled = false,
  ...props
}: Props) {
  return (
    <button {...props} className={button({ color, fullWidth, disabled })}>
      {children}
    </button>
  );
}
