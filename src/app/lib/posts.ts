"use server";

import { db } from "@/db";
import {
  comments,
  follows,
  images,
  ImageType,
  likes,
  notifications,
  posts,
  users,
  VISIBILITY_PUBLIC,
} from "@/db/schema";
import { and, count, desc, eq, exists, inArray, or, sql } from "drizzle-orm";
import { getCurrentSession } from "../auth/session";
import { internalTagRegex } from "../utils/mentions";
import { getRelevantLikesForPosts, RelevantLikesData } from "./likes";
import { deleteObjects } from "./s3";
import { userRelationship } from "../../../drizzle/schema";

export type EnhancedPost = {
  post_id: number;
  text: string | null;
  date: string;
  user_id: number;
  author: string;
  displayName: string;
  comment_count: number;
  liked: boolean;
  relevant_likes: RelevantLikesData;
  images: ImageType[];
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
  target_user_id: number | null = null,
): Promise<EnhancedPost[]> {
  const { user } = await getCurrentSession();
  if (user === null) {
    return [];
  }

  const baseQuery = db
    .select({
      post_id: posts.post_id,
      text: posts.text,
      date: posts.created_at,
      user_id: posts.user_id,
      author: users.username,
      displayName: users.name,
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

  const visibilityFilter = or(
    eq(posts.visibilitytype, VISIBILITY_PUBLIC),
    eq(posts.user_id, user.user_id),
    exists(
      db
        .select()
        .from(userRelationship)
        .where(
          and(
            eq(userRelationship.userId, posts.user_id),
            eq(userRelationship.targetUserId, user.user_id),
          ),
        ),
    ),
  );

  if (target_post_id !== null) {
    baseQuery.where(and(eq(posts.post_id, target_post_id), visibilityFilter));
  } else if (target_user_id) {
    baseQuery.where(and(eq(posts.user_id, target_user_id), visibilityFilter));
  } else if (target_following_only) {
    baseQuery.where(
      and(
        or(
          eq(posts.user_id, user.user_id),
          exists(
            db
              .select()
              .from(follows)
              .where(
                and(
                  eq(follows.follower_id, user.user_id),
                  eq(follows.following_id, posts.user_id),
                ),
              ),
          ),
        ),
        visibilityFilter,
      ),
    );
  } else {
    baseQuery.where(visibilityFilter);
  }

  const results = await baseQuery
    .groupBy(posts.post_id, users.user_id, users.username)
    .orderBy(desc(posts.created_at))
    .limit(target_post_id ? 1 : FETCH_LIMIT)
    .offset(offset);

  const post_ids = results.map((post) => post.post_id);

  const relevantLikesMap = await getRelevantLikesForPosts(post_ids);

  const imagesQuery = await db
    .select({
      post_id: images.post_id,
      image_data: sql<
        ImageType[]
      >`json_agg(${images}.* ORDER BY ${images.display_order}) ASC`,
    })
    .from(images)
    .where(inArray(images.post_id, post_ids))
    .groupBy(images.post_id);

  // Create a map of post_id to images
  const imagesMap = new Map(
    imagesQuery.map((item) => [item.post_id, item.image_data]),
  );

  return results.map((post) => ({
    ...post,
    author: post.author ?? "", // TODO: author is not nullable. why do i have to do this?
    displayName: post.displayName ?? "",
    images: imagesMap.get(post.post_id) || [],
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
      postdate: posts.created_at,
      user_id: users.user_id,
      poster: users.username,
      comment_count: count(comments.comment_id),
      imageBlobUrl: images.image_blob_url,
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
      images.image_blob_url,
      images.width,
      images.height,
    );

  return results[0];
}

export async function deletePost(post_id: number) {
  const { user } = await getCurrentSession();
  if (user === null) {
    return;
  }

  await deleteObjects(post_id);

  await db
    .delete(posts)
    .where(and(eq(posts.user_id, user.user_id), eq(posts.post_id, post_id)));
}

export async function getPostCount(user_id: number): Promise<number | null> {
  const { user: current_user } = await getCurrentSession();
  if (current_user === null) {
    return null;
  }

  const post_count = await db
    .select({
      count: sql<number>`cast(count(${posts.user_id}) as int)`,
    })
    .from(posts)
    .where(eq(posts.user_id, user_id))
    .groupBy(posts.user_id);

  return post_count.length > 0 ? post_count[0].count : 0;
}
