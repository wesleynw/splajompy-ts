import React, { Dispatch, ReactNode, SetStateAction } from "react";

type Props = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  icon?: ReactNode;
};

export default function Input({ value, setValue, icon }: Readonly<Props>) {
  return (
    <div className="m-2 flex w-full flex-row rounded-xl bg-neutral-800 p-3 outline-neutral-600 transition-all has-[input:focus-within]:outline-1">
      {icon}
      <input
        autoFocus
        placeholder="Search"
        className="ml-2 w-full focus:outline-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
