import { auth } from "@/auth";
import { sql } from "@vercel/postgres";

export default async function Page() {
  const session = await auth();
  if (!session) {
    return <></>;
  }

  const result = await sql`
          SELECT *
          FROM posts
          JOIN USERS ON posts.user_id = users.id
    `;
  const posts = result.rows;

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <strong>{post.email} says: </strong>
          {post.text}
        </li>
      ))}
    </ul>
  );
}
