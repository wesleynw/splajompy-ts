import AccountView from "@/app/components/account/AccountView";
import { getPostsByUserId } from "@/app/lib/posts";
import { getUserByUsername } from "@/app/lib/users";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  return {
    title: `${params.slug}'s Profile`,
  };
}

export default async function Page({
  params,
}: Readonly<{ params: { slug: string } }>) {
  const username = String(params.slug);

  const session = await auth();

  const user = await getUserByUsername(username);

  if (!user) {
    // TODO: better 404 page
    return <h1>User not found</h1>;
  }

  const posts = await getPostsByUserId(user.user_id);

  return (
    <SessionProvider session={session}>
      <AccountView user={user} posts={posts} />
    </SessionProvider>
  );
}
