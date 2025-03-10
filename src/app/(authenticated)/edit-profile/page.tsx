import { getCurrentSession } from "@/app/auth/session";
import ProfileEdit from "@/app/components/user/ProfileEdit";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await getCurrentSession();

  if (user === null) {
    redirect("/");
  }

  return <ProfileEdit username={user.username} />;
}
