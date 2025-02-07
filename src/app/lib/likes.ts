"use server";

import { db } from "@/db";
import { follows, likes, notifications, users } from "@/db/schema";
import {
  and,
  desc,
  eq,
  exists,
  inArray,
  isNull,
  ne,
  notInArray,
  sql,
} from "drizzle-orm";
import { getCurrentSession } from "../auth/session";
import { seededRandom } from "../utils/random";
import { getCommentById } from "./comments";
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

  let recipient_id = post.user_id;
  if (comment_id) {
    const comment = await getCommentById(comment_id);
    recipient_id = comment?.user_id ?? recipient_id; // TODO: this is dumb
  }

  await db.insert(notifications).values({
    user_id: recipient_id,
    message: `@${user.username} liked your ${comment_id ? "comment" : "post"}`,
    link: `/post/${post_id}`,
  });
}

export async function removeLike(
  post_id: number,
  comment_id?: number
): Promise<void> {
  const { user } = await getCurrentSession();
  if (user === null) {
    return;
  }

  console.warn(
    `user: ${user.username} is removing like from post: ${post_id}, comment: ${comment_id}`
  );

  await db
    .delete(likes)
    .where(
      and(
        eq(likes.post_id, post_id),
        eq(likes.user_id, user.user_id),
        comment_id !== undefined
          ? eq(likes.comment_id, comment_id)
          : isNull(likes.comment_id)
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
        comment_id !== null && comment_id !== undefined
          ? eq(likes.comment_id, comment_id)
          : isNull(likes.comment_id)
      )
    )
    .limit(1);

  return result.length > 0;
}

export async function toggleLiked(
  post_id: number,
  comment_id?: number
): Promise<void> {
  const { user } = await getCurrentSession();
  if (user === null) {
    return;
  }

  const liked = await isLiked(post_id, comment_id);
  if (liked) {
    await removeLike(post_id, comment_id);
  } else {
    await addLike(post_id, comment_id);
  }
}

export type RelevantLikesData = {
  likes: { user_id: number; username: string }[];
  hasOtherLikes: boolean;
};

export async function getRelevantLikesForPosts(
  post_ids: number[]
): Promise<Map<number, RelevantLikesData>> {
  const { user } = await getCurrentSession();
  if (user === null) {
    return new Map();
  }

  if (post_ids.length === 0) return new Map();

  const relevantLikes = await db
    .select({
      post_id: likes.post_id,
      username: users.username,
      user_id: users.user_id,
    })
    .from(likes)
    .leftJoin(users, eq(likes.user_id, users.user_id))
    .where(
      and(
        inArray(likes.post_id, post_ids),
        isNull(likes.comment_id),
        exists(
          db
            .select()
            .from(follows)
            .where(
              and(
                eq(follows.follower_id, user.user_id),
                eq(follows.following_id, likes.user_id)
              )
            )
        )
      )
    )
    .orderBy(desc(users.user_id));

  const relevantLikesMap = new Map<
    number,
    { username: string; user_id: number }[]
  >();

  relevantLikes.forEach((like) => {
    if (!relevantLikesMap.has(like.post_id))
      relevantLikesMap.set(like.post_id, []);
    if (like.username !== null && like.user_id !== null) {
      relevantLikesMap.get(like.post_id)?.push({
        username: like.username,
        user_id: like.user_id,
      });
    }
  });

  const otherLikesCounts = await db
    .select({
      post_id: likes.post_id,
      count: sql<number>`COUNT(*)`,
    })
    .from(likes)
    .where(
      and(
        inArray(likes.post_id, post_ids),
        isNull(likes.comment_id),
        ne(likes.user_id, user.user_id),
        notInArray(
          likes.user_id,
          relevantLikes.map((l) => l.user_id).filter((id) => id !== null)
        )
      )
    )
    .groupBy(likes.post_id);

  const otherLikesMap = new Map(
    otherLikesCounts.map((like) => [like.post_id, like.count > 0])
  );

  const resultMap = new Map();
  post_ids.forEach((post_id) => {
    const likes = relevantLikesMap.get(post_id) || [];
    const shuffled = likes
      .toSorted(
        (a, b) =>
          seededRandom(post_id + a.user_id) - seededRandom(post_id + b.user_id)
      )
      .slice(0, 2);

    resultMap.set(post_id, {
      likes: shuffled,
      hasOtherLikes: otherLikesMap.get(post_id) || false,
    });
  });

  return resultMap;
}
