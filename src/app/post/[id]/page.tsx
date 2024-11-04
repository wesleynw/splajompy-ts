import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import SinglePostPage from "@/app/components/post/SinglePagePost";
import { auth } from "@/auth";
import { sql } from "@vercel/postgres";
import { PostWithUser } from "@/types/post";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) {
    return <></>;
  }
  const id = (await params).id;

  const result = await sql<PostWithUser>`
          SELECT *
          FROM posts
          JOIN users ON posts.user_id = users.user_id
          WHERE posts.post_id = ${id}
    `;
  const post = result.rows[0];

  console.log("post: ", post);

  return <SinglePostPage post={post} />;
}
