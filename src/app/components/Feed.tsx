import { auth } from "@/auth";
import Post from "./post/Post";
import { Box } from "@mui/material";
import { db } from "@/db";
import { posts, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export default async function Page() {
  const session = await auth();
  if (!session) {
    return <></>;
  }

  const results = await db
    .select()
    .from(posts)
    .innerJoin(users, eq(posts.user_id, users.user_id))
    .orderBy(desc(posts.postdate));

  return (
    <Box>
      {results.map((post) => (
        <Post
          key={post.posts.post_id}
          id={post.posts.post_id}
          date={new Date(post.posts.postdate + "Z")} // + "Z" to conver to UTC
          content={post.posts.text}
          poster={post.users?.username}
        />
      ))}
    </Box>
  );
}
