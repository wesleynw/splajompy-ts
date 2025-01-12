"use server";

import { db } from "@/db";
import { follows, notifications } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getCurrentSession } from "../auth/session";

export async function isFollowingUser(user_id: number) {
  const { user } = await getCurrentSession();

  if (!user?.user_id || user.user_id === user_id) {
    return null;
  }

  const results = await db
    .select()
    .from(follows)
    .where(
      and(
        eq(follows.follower_id, user?.user_id),
        eq(follows.following_id, user_id)
      )
    );

  return results.length > 0;
}

export async function followUser(user_id: number) {
  const { user } = await getCurrentSession();
  if (user === null) {
    return;
  }

  if (!user.user_id || user.user_id === user_id) {
    console.error("Cannot follow yourself");
    return;
  }

  await db.insert(follows).values({
    follower_id: user.user_id,
    following_id: user_id,
  });

  await db.insert(notifications).values({
    user_id,
    message: `@${user.username} started following you`,
    link: `/user/${user.username}`,
  });
}

export async function unfollowUser(user_id: number) {
  const { user } = await getCurrentSession();

  if (user === null || user.user_id === user_id) {
    return;
  }

  await db
    .delete(follows)
    .where(
      and(
        eq(follows.follower_id, user.user_id),
        eq(follows.following_id, user_id)
      )
    );
}
