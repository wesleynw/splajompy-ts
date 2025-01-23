"use server";

import { db } from "@/db";
import { likes, notifications } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { getCurrentSession } from "../auth/session";
import { getPostById } from "./posts";

export async function addLike(
  post_id: number,
  comment_id?: number
): Promise<void> {
  const { user } = await getCurrentSession();
  if (user === null) {
    return;
  }

  console.warn(
    `user: ${user.username} is liking post: ${post_id}, comment: ${comment_id}`
  );

  const post = await getPostById(post_id);
  if (post == null) {
    return;
  }

  await db.insert(likes).values({
    post_id: post_id,
    comment_id: comment_id,
    user_id: user.user_id,
  });

  if (user.user_id !== post.user_id) {
    await db.insert(notifications).values({
      user_id: post.user_id,
      message: `@${user.username} liked your ${
        comment_id ? "comment" : "post"
      }`,
      link: `/post/${post_id}`,
    });
  }
}

export async function removeLike(
  post_id: number,
  comment_id?: number
): Promise<void> {
  const { user } = await getCurrentSession();
  if (user === null) {
    return;
  }

  await db
    .delete(likes)
    .where(
      and(
        eq(likes.post_id, post_id),
        eq(likes.user_id, user.user_id),
        comment_id ? eq(likes.comment_id, comment_id) : sql`1 = 1`
      )
    );
}

export async function isLiked(post_id: number, comment_id?: number) {
  const { user } = await getCurrentSession();
  if (user === null) {
    return;
  }

  const result = await db
    .select()
    .from(likes)
    .where(
      and(
        eq(likes.user_id, user.user_id),
        eq(likes.post_id, post_id),
        comment_id ? eq(likes.comment_id, comment_id) : sql`1 = 1`
      )
    )
    .limit(1);

  return result.length > 0;
}
