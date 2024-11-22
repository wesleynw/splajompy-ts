"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { comments, images, posts, users } from "@/db/schema";
import { and, count, desc, eq } from "drizzle-orm";
import { deleteObject } from "./s3";

export async function getAllPosts() {
  const results = await db
    .select({
      post_id: posts.post_id,
      text: posts.text,
      postdate: posts.postdate,
      user_id: users.user_id,
      poster: users.username,
      comment_count: count(comments.comment_id),
      imageBlobUrl: images.imageBlobUrl,
      imageWidth: images.width,
      imageHeight: images.height,
    })
    .from(posts)
    .innerJoin(users, eq(posts.user_id, users.user_id))
    .leftJoin(comments, eq(posts.post_id, comments.post_id))
    .leftJoin(images, eq(posts.post_id, images.post_id))
    .groupBy(
      posts.post_id,
      users.user_id,
      images.imageBlobUrl,
      images.width,
      images.height
    )
    .orderBy(desc(posts.postdate));

  return results;
}

export async function deletePost(post_id: number) {
  const session = await auth();
  if (!session || !session.user) {
    return;
  }

  await deleteObject(post_id);

  await db
    .delete(posts)
    .where(
      and(eq(posts.user_id, session.user.user_id), eq(posts.post_id, post_id))
    );
}
