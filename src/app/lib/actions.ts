"use server";

import { db } from "@/db";
import { comments, images, users } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function insertImage(
  post_id: number,
  imageBlobUrl: string,
  width: number,
  height: number
) {
  await db.insert(images).values({
    post_id: post_id,
    height: height,
    width: width,
    imageBlobUrl: imageBlobUrl,
  });

  revalidatePath("/");
}

export async function getComments(post_id: number) {
  const results = await db
    .select()
    .from(comments)
    .innerJoin(users, eq(comments.user_id, users.user_id))
    .where(eq(comments.post_id, post_id))
    .orderBy(asc(comments.comment_date));

  return results;
}

export async function getUsername(user_id: number) {
  const results = await db
    .select()
    .from(users)
    .where(eq(users.user_id, user_id))
    .limit(1);

  return results[0].username;
}
