"use server";

import { db } from "@/db";
import { likes } from "@/db/schema";
import { and, count, eq } from "drizzle-orm";

export async function likePost(post_id: number, user_id: number) {
  await db.insert(likes).values({
    post_id,
    user_id,
  });
}

export async function unlikePost(post_id: number, user_id: number) {
  await db
    .delete(likes)
    .where(and(eq(likes.post_id, post_id), eq(likes.user_id, user_id)));
}

export async function getLikeData(post_id: number, user_id: number) {
  const like = await db
    .select()
    .from(likes)
    .where(and(eq(likes.post_id, post_id), eq(likes.user_id, user_id)));

  const likeCount = await db
    .select({ count: count() })
    .from(likes)
    .where(eq(likes.post_id, post_id));

  return {
    isLiked: like.length > 0,
    likeCount: likeCount[0].count ?? 0,
  };
}
