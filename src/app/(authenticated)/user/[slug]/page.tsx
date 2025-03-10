import { getCurrentSession } from "@/app/auth/session";
import UserView from "@/app/components/user/UserView";
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

  const { user } = await getCurrentSession();

  if (user === null) {
    redirect("/login");
  }

  if (!username) {
    redirect("/");
  }

  return (
    <UserView
      user={user}
      username={username}
      isOwnProfile={username === user.username}
    />
  );
}
