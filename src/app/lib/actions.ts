"use server";

import { db } from "@/db";
import { images, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function insertImage(
  post_id: number,
  imageBlobUrl: string,
  width: number,
  height: number,
  displayOrder: number = 0,
) {
  await db.insert(images).values({
    post_id: post_id,
    height: height,
    width: width,
    image_blob_url: imageBlobUrl,
    display_order: displayOrder,
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
