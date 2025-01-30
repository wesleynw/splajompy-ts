"use server";

import { db } from "@/db";
import { follows, likes, notifications, users } from "@/db/schema";
import { and, desc, eq, exists, isNull, ne, notExists } from "drizzle-orm";
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

export async function getRelevantLikes(post_id: number) {
  const { user } = await getCurrentSession();
  if (user === null) {
    return;
  }

  const relevantLikes = await db
    .select({ username: users.username, user_id: users.user_id })
    .from(likes)
    .leftJoin(users, eq(likes.user_id, users.user_id))
    .where(
      and(
        eq(likes.post_id, post_id),
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

  const hasOthers =
    (
      await db
        .select({})
        .from(likes)
        .where(
          and(
            eq(likes.post_id, post_id),
            isNull(likes.comment_id),
            ne(likes.user_id, user.user_id),
            notExists(
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
        .limit(1)
    ).length > 0;

  const shuffled = relevantLikes.toSorted((a, b) => {
    return (
      seededRandom(post_id + (a.user_id ?? 0)) -
      seededRandom(post_id + (b.user_id ?? 0))
    );
  });

  return { likes: shuffled.slice(0, 2), hasOthers };
}
