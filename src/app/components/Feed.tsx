import { auth } from "@/auth";
import Post from "./post/Post";
import { Box } from "@mui/material";
import { db } from "@/db";
import { comments, posts, users } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";

export default async function Page() {
  const session = await auth();
  if (!session) {
    return <></>;
  }

  const results = await db
    .select({
      post_id: posts.post_id,
      text: posts.text,
      postdate: posts.postdate,
      poster: users.username,
      comment_count: count(comments.comment_id),
    })
    .from(posts)
    .innerJoin(users, eq(posts.user_id, users.user_id))
    .leftJoin(comments, eq(posts.post_id, comments.post_id))
    .groupBy(posts.post_id, users.user_id)
    .orderBy(desc(posts.postdate));

  return (
    <Box>
      {results.map((post) => (
        <Post
          key={post.post_id}
          id={post.post_id}
          date={new Date(post.postdate + "Z")} // + "Z" to conver to UTC
          content={post.text}
          poster={post.poster}
          comment_count={post.comment_count}
        />
      ))}
    </Box>
  );
}
