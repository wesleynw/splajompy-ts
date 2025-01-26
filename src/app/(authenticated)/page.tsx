import { redirect } from "next/navigation";
import { getCurrentSession } from "../auth/session";
import Feed from "../components/feed/Feed";

export default async function Home() {
  const { user } = await getCurrentSession();
  if (user === null) {
    redirect("/login");
  }

  return <Feed user={user} page="home" />;
}
