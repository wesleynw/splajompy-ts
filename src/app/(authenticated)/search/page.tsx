import { getCurrentSession } from "@/app/auth/session";
import SearchPage from "@/app/components/search/SearchPage";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Search",
};

export default async function Page() {
  const { user } = await getCurrentSession();
  if (user === null) {
    redirect("/login");
  }

  return <SearchPage />;
}
