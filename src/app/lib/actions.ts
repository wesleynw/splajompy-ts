"use server";

import { db } from "@/db";
import { images, users } from "@/db/schema";
import { eq } from "drizzle-orm";

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
}

export async function getUsername(user_id: number) {
  const results = await db
    .select()
    .from(users)
    .where(eq(users.user_id, user_id))
    .limit(1);

  return results[0].username;
}
