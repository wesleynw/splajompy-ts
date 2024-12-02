"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { follows } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function isFollowingUser(user_id: number) {
  const session = await auth();

  if (!session?.user?.user_id || session.user.user_id === user_id) {
    return null;
  }

  const results = await db
    .select()
    .from(follows)
    .where(
      and(
        eq(follows.follower_id, session?.user?.user_id),
        eq(follows.following_id, user_id)
      )
    );

  return results.length > 0;
}

export async function followUser(user_id: number) {
  const session = await auth();

  if (!session?.user?.user_id || session.user.user_id === user_id) {
    console.error("Cannot follow yourself");
    return;
  }

  await db.insert(follows).values({
    follower_id: session.user.user_id,
    following_id: user_id,
  });
}

export async function unfollowUser(user_id: number) {
  const session = await auth();

  if (!session?.user?.user_id || session.user.user_id === user_id) {
    return;
  }

  await db
    .delete(follows)
    .where(
      and(
        eq(follows.follower_id, session.user.user_id),
        eq(follows.following_id, user_id)
      )
    );
}
