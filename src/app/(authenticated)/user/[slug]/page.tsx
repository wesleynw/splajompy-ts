import { getCurrentSession } from "@/app/auth/session";
import UserView from "@/app/components/user/UserView";
import { getUserByUsername } from "@/app/lib/users";
import { redirect } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  return {
    title: `${params.slug}'s Profile`,
  };
}

export default async function Page({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const slug = (await params).slug;
  const username = String(slug);

  const { user: current_user } = await getCurrentSession();

  if (current_user === null) {
    redirect("/login");
  }

  if (!username) {
    redirect("/");
  }

  const target_user = await getUserByUsername(username);

  if (target_user === null) {
    redirect("/");
  }

  return (
    <UserView
      current_user={current_user}
      target_user={target_user}
      username={username}
      isOwnProfile={username === current_user.username}
    />
  );
}
