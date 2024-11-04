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
          SELECT *
          FROM posts
          JOIN USERS ON posts.user_id = users.user_id
          ORDER BY posts.POSTDATE DESC
    `;
  const posts = result.rows;

  return (
    <Box>
      {posts.map((post) => (
        <Post
          key={post.post_id}
          id={post.post_id}
          date={new Date(post.postdate + "Z")} // + "Z" to conver to UTC
          content={post.text}
          poster={post.username}
        />
      ))}
    </Box>
  );
}
