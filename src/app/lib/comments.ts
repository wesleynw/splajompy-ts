"use server";

import { db } from "@/db";
import { comments, notifications, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentSession } from "../auth/session";
import { internalTagRegex } from "../utils/mentions";

export async function insertComment(
  text: string,
  post_id: number,
  poster: number
) {
  const { user } = await getCurrentSession();
  if (user === null) {
    return;
  }

  if (text) {
    const comment = await db
      .insert(comments)
      .values({
        post_id: Number(post_id),
        user_id: user.user_id,
        text: text,
      })
      .returning();

    const result = await db
      .select()
      .from(comments)
      .innerJoin(users, eq(comments.user_id, users.user_id))
      .where(eq(comments.comment_id, comment[0].comment_id))
      .limit(1);

    for (const tag of text.matchAll(internalTagRegex)) {
      const user_id = Number(tag[1]);
      if (user.user_id !== user_id && user_id !== poster) {
        await db.insert(notifications).values({
          user_id: user_id,
          message: `@${user.username} mentioned you in a comment`,
          link: `/post/${post_id}`,
        });
      }
    }

    if (poster !== user.user_id) {
      await db.insert(notifications).values({
        user_id: poster,
        message: `@${user.username} commented on your post`,
        link: `/post/${post_id}`,
      });
    }

    return result;
  }
}
