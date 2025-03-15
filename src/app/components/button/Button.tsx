import { cva, type VariantProps } from "cva";
import React, { ReactNode } from "react";

const button = cva(
  "m-1 py-1 px-2.5 font-bold transition-all select-none text-neutral-100",
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
        true: ["w-full", "rounded-sm", "py-2"],
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

export type Props = { children: ReactNode; isLoading?: boolean } & VariantProps<
  typeof button
> &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">;

export default function Button({
  children,
  color = "default",
  fullWidth = false,
  disabled = false,
  isLoading = false,
  ...props
}: Props) {
  return (
    <button {...props} className={button({ color, fullWidth, disabled })}>
      <div className="relative flex w-full flex-row items-center justify-center">
        <div
          className={`flex flex-row items-center ${isLoading ? "invisible" : "visible"}`}
        >
          {children}
        </div>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"></div>
          </div>
        )}
      </div>
    </button>
  );
}
