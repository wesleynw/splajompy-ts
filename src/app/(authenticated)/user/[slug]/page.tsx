import { getCurrentSession } from "@/app/auth/session";
import CenteredLayout from "@/app/components/layout/CenteredLayout";
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

  const { session, user: session_user } = await getCurrentSession();

  if (session === null) {
    redirect("/login");
  }

  const user = await getUserByUsername(username);

  if (!user) {
    return (
      <CenteredLayout>
        <p className="mt-5 text-xl font-black">This user doesn&apos;t exist.</p>
      </CenteredLayout>
    );
  }

  return (
    <UserView
      user={user}
      isOwnProfile={user.user_id === session_user.user_id}
    />
  );
}
