"use server";

import { db } from "@/db";
import { Comment, comments, notifications, User, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { getCurrentSession } from "../auth/session";
import { internalTagRegex } from "../utils/mentions";
import { isLiked } from "./likes";
import { getPostById } from "./posts";

export type CommentWithLike = Comment & { isLiked: boolean };

export async function getCommentsByPost(
  post_id: number
): Promise<{ comment: CommentWithLike; user: User }[]> {
  const { user } = await getCurrentSession();
  if (!user) {
    return [];
  }

  const results = await db
    .select()
    .from(comments)
    .innerJoin(users, eq(comments.user_id, users.user_id))
    .where(eq(comments.post_id, post_id))
    .orderBy(desc(comments.comment_date));

  const commentsWithUsers = await Promise.all(
    results.map(async (result) => {
      const liked =
        (await isLiked(post_id, result.comments.comment_id)) ?? false;

      return {
        comment: {
          ...result.comments,
          isLiked: liked,
        },
        user: result.users,
      };
    })
  );

  return commentsWithUsers;
}

export async function getCommentById(
  comment_id: number
): Promise<Comment | undefined> {
  const { user } = await getCurrentSession();
  if (!user) {
    return;
  }

  const results = await db
    .select()
    .from(comments)
    .where(eq(comments.comment_id, comment_id))
    .limit(1);

  return results.length > 0 ? results[0] : undefined;
}

export async function insertComment(post_id: number, text: string) {
  const { user } = await getCurrentSession();
  if (user === null) {
    return;
  }

  const post = await getPostById(post_id);
  if (!post) {
    return;
  }

  const comment = await db
    .insert(comments)
    .values({
      post_id: Number(post_id),
      user_id: user.user_id,
      text: text,
    })
    .returning();

  const result = await db
    .select()
    .from(comments)
    .innerJoin(users, eq(comments.user_id, users.user_id))
    .where(eq(comments.comment_id, comment[0].comment_id))
    .limit(1);

  for (const tag of text.matchAll(internalTagRegex)) {
    const user_id = Number(tag[1]);
    if (user.user_id !== user_id && user_id !== post.user_id) {
      await db.insert(notifications).values({
        user_id: user_id,
        message: `@${user.username} mentioned you in a comment`,
        link: `/post/${post_id}`,
      });
    }
  }

  if (post.user_id !== user.user_id) {
    await db.insert(notifications).values({
      user_id: post.user_id,
      message: `@${user.username} commented on your post`,
      link: `/post/${post_id}`,
    });
  }

  return result;
}
