import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import SinglePostPage from "@/app/components/post/SinglePagePost";
import { auth } from "@/auth";
import { db } from "@/db";
import { posts, users } from "@/db/schema";
import { eq } from "drizzle-orm";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const session = await auth();
  if (!session) {
    return <></>;
  }
  const id = (await params).id;

  const result = await db
    .select({
      post_id: posts.post_id,
      postdate: posts.postdate,
      text: posts.text,
      user_id: users.user_id,
      username: users.username,
      email: users.email,
      password: users.password,
    })
    .from(posts)
    .innerJoin(users, eq(posts.user_id, users.user_id))
    .where(eq(posts.post_id, id))
    .limit(1);

  return <SinglePostPage post={result[0]} />;
}
