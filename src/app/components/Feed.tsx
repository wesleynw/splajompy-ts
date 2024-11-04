import { auth } from "@/auth";
import { sql } from "@vercel/postgres";
import Post from "./post/Post";
import { Box } from "@mui/material";

export default async function Page() {
  const session = await auth();
  if (!session) {
    return <></>;
  }

  const result = await sql`
          SELECT posts.id AS post_id, *
          FROM posts
          JOIN USERS ON posts.user_id = users.id
          ORDER BY posts.POSTDATE DESC
    `;
  const posts = result.rows;

  return (
    <Box>
      {posts.map((post) => (
        <Post
          key={post.post_id}
          date={new Date(post.postdate + "Z")} // + "Z" to conver to UTC
          content={post.text}
          poster={post.username}
        />
      ))}
    </Box>
  );
}
