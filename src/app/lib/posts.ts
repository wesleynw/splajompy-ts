"use server";

import { db } from "@/db";
import {
  comments,
  follows,
  images,
  likes,
  notifications,
  posts,
  users,
} from "@/db/schema";
import { and, count, desc, eq, exists, or, sql } from "drizzle-orm";
import { getCurrentSession } from "../auth/session";
import { internalTagRegex } from "../utils/mentions";
import { getRelevantLikesForPosts, RelevantLikesData } from "./likes";
import { deleteObject } from "./s3";

export type EnhancedPost = {
  post_id: number;
  text: string | null;
  date: string;
  user_id: number;
  author: string;
  comment_count: number;
  liked: boolean;
  relevant_likes: RelevantLikesData;
  image_blob_url: string | null;
  image_width: number | null;
  image_height: number | null;
};

const FETCH_LIMIT = 10;

export async function insertPost(text: string) {
  const { user } = await getCurrentSession();
  if (user === null) {
    return;
  }

  const post = await db
    .insert(posts)
    .values({
      user_id: Number(user.user_id),
      text: text,
    })
    .returning();

  for (const tag of text.matchAll(internalTagRegex)) {
    const user_id = Number(tag[1]);
    if (user.user_id !== user_id) {
      await db.insert(notifications).values({
        user_id: user_id,
        message: `@${user.username} mentioned you in a post`,
        link: `/post/${post[0].post_id}`,
      });
    }
  }
  return post[0];
}

export async function fetchPosts(
  offset: number = 0,
  target_following_only: boolean = false,
  target_post_id: number | null = null,
  target_user_id: number | null = null
): Promise<EnhancedPost[]> {
  const { user } = await getCurrentSession();
  if (user === null) {
    return [];
  }

  const baseQuery = db
    .select({
      post_id: posts.post_id,
      text: posts.text,
      date: posts.postdate,
      user_id: posts.user_id,
      author: users.username,
      image_blob_url: images.imageBlobUrl,
      image_width: images.width,
      image_height: images.height,
      comment_count: sql<number>`COUNT(DISTINCT ${comments.comment_id})`,
      liked: sql<boolean>`
        EXISTS (
          SELECT 1 FROM ${likes}
          WHERE ${likes.post_id} = ${posts.post_id}
            AND ${likes.user_id} = ${user.user_id}
            AND ${likes.comment_id} IS NULL
        )
      `,
    })
    .from(posts)
    .leftJoin(users, eq(users.user_id, posts.user_id))
    .leftJoin(comments, eq(comments.post_id, posts.post_id))
    .leftJoin(images, eq(images.post_id, posts.post_id));

  if (target_post_id !== null) {
    baseQuery.where(eq(posts.post_id, target_post_id));
  } else if (target_user_id) {
    baseQuery.where(eq(posts.user_id, target_user_id));
  } else if (target_following_only) {
    baseQuery.where(
      or(
        eq(posts.user_id, user.user_id),
        exists(
          db
            .select()
            .from(follows)
            .where(
              and(
                eq(follows.follower_id, user.user_id),
                eq(follows.following_id, posts.user_id)
              )
            )
        )
      )
    );
  }

  const results = await baseQuery
    .groupBy(
      posts.post_id,
      users.user_id,
      users.username,
      images.imageBlobUrl,
      images.width,
      images.height
    )
    .orderBy(desc(posts.postdate))
    .limit(target_post_id ? 1 : FETCH_LIMIT)
    .offset(offset);

  const post_ids = results.map((post) => post.post_id);

  const relevantLikesMap = await getRelevantLikesForPosts(post_ids);

  return results.map((post) => ({
    ...post,
    author: post.author ?? "", // TODO: author is not nullable. why do i have to do this?
    relevant_likes: relevantLikesMap?.get(post.post_id) ?? {
      likes: [],
      hasOtherLikes: false,
    }, // TODO: this also isn't nullable. i'll leave this here for now
  }));
}

export async function getPostById(post_id: number) {
  const { user } = await getCurrentSession();
  if (user === null) {
    return;
  }

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
      liked: sql<boolean>`
      EXISTS (
        SELECT 1
        FROM ${likes}
        WHERE ${likes.post_id} = ${posts.post_id}
          AND ${likes.user_id} = ${user.user_id}
          AND ${likes.comment_id} IS NULL
      )
    `,
    })
    .from(posts)
    .innerJoin(users, eq(posts.user_id, users.user_id))
    .leftJoin(comments, eq(posts.post_id, comments.post_id))
    .leftJoin(images, eq(posts.post_id, images.post_id))
    .where(eq(posts.post_id, post_id))
    .groupBy(
      posts.post_id,
      users.user_id,
      images.imageBlobUrl,
      images.width,
      images.height
    );

  return results[0];
}

export async function deletePost(post_id: number) {
  const { user } = await getCurrentSession();
  if (user === null) {
    return;
  }

  await deleteObject(post_id);

  await db
    .delete(posts)
    .where(and(eq(posts.user_id, user.user_id), eq(posts.post_id, post_id)));
}
