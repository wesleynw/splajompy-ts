"use client";

import { Dispatch, SetStateAction } from "react";
import CancelCircleIcon from "../icons/CancelCircleIcon";
import SearchIcon from "../icons/SearchIcon";

type Props = {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
};

export default function SearchBar({ query, setQuery }: Readonly<Props>) {
  return (
    <div className="m-2 flex w-full flex-row rounded-xl bg-neutral-800 p-3 outline-neutral-600 transition-all has-[input:focus-within]:outline-1">
      <SearchIcon />
      <input
        autoFocus
        placeholder="Search"
        className="ml-2 w-full focus:outline-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        onClick={() => setQuery("")}
        className={`hover:cursor-pointer ${query.length > 0 ? "visible" : "invisible"}`}
      >
        <CancelCircleIcon />
      </button>
    </div>
  );
}
