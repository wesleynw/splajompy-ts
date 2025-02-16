"use client";

import { useSearch } from "@/app/data/search";
import { useState } from "react";
import CenteredLayout from "../layout/CenteredLayout";
import Spinner from "../loading/Spinner";
import SearchBar from "./SearchBar";
import SearchResult from "./SearchResult";

export default function SearchPage() {
  const [query, setQuery] = useState<string>("");
  const { isPending, data } = useSearch(query);

  return (
    <CenteredLayout>
      <SearchBar query={query} setQuery={setQuery} />
      <div className="my-3 h-0.5 w-full rounded-full bg-neutral-800"></div>
      {isPending && query.length > 0 ? (
        <Spinner />
      ) : (
        data?.length === 0 &&
        query && <p className="mt-10 text-lg font-black">No results</p>
      )}
      {data?.map((user) => {
        return <SearchResult key={user.user_id} user={user} />;
      })}
    </CenteredLayout>
  );
}
