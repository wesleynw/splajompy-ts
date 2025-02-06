import { getCurrentSession } from "@/app/auth/session";
import Feed from "@/app/components/feed/Feed";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await getCurrentSession();
  if (user === null) {
    redirect("/login");
  }

  return <Feed user={user} />;
}
