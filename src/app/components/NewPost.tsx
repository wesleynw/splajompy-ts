import { auth } from "@/auth";
import { sql } from "@vercel/postgres";
import { postTextSchema } from "../lib/zod";

export default async function Page() {
  async function insertPost(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session) {
      console.error("not logged in");
      return;
    }

    const postText = formData.get("text")?.toString();

    const parsed = postTextSchema.safeParse({ text: postText });
    if (!parsed.success) {
      console.error(parsed.error.issues);
      return;
    }

    const sanitizedPostText = parsed.data.text;

    if (postText) {
      await sql`
      INSERT INTO posts (user_id, text)
      VALUES (${session?.user?.id}, ${sanitizedPostText})
    `;
    }
  }

  return (
    <form action={insertPost}>
      <input type="text" name="text" />
      <button type="submit">post</button>
    </form>
  );
}
