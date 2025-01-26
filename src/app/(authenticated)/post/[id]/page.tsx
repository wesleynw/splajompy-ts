import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { db } from "@/db";
import { posts, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import SinglePagePost from "@/app/components/post/SinglePost";
import { Suspense } from "react";
import SinglePostSkeleton from "@/app/components/loading/SinglePostSkeleton";
import StandardWrapper from "@/app/components/loading/StandardWrapper";
import { getCurrentSession } from "@/app/auth/session";
import { toDisplayFormat } from "@/app/utils/mentions";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = Number((await params).id);

  const post = await db
    .select({ username: users.username, text: posts.text })
    .from(posts)
    .where(eq(posts.post_id, id))
    .innerJoin(users, eq(posts.user_id, users.user_id))
    .limit(1);

  if (post.length === 0) {
    return {
      title: "Post not found",
      description: "This post cannot be found.",
    };
  }

  return {
    title: `${post[0].username}: ${
      toDisplayFormat(post[0].text ?? "") || "Image"
    }`,
    description: toDisplayFormat(post[0].text ?? "") ?? "",
  };
}

export default async function Page({
  params,
}: Readonly<{
  params: Promise<{ id: number }>;
}>) {
  const { user } = await getCurrentSession();
  if (user === null) {
    redirect("/login");
  }

  const post_id = (await params).id;

  return (
    <Suspense
      fallback={
        <StandardWrapper>
          <SinglePostSkeleton />
        </StandardWrapper>
      }
    >
      <SinglePagePost post_id={post_id} user={user} />
    </Suspense>
  );
}
