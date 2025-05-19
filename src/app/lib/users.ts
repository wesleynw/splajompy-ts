"use server";

import { db } from "@/db";
import { bios, PublicUser, User, users } from "@/db/schema";
import { desc, eq, ilike, or } from "drizzle-orm";
import { getCurrentSession } from "../auth/session";
import { isFollowing } from "./follows";
import { getPostCount } from "./posts";

export type EnhancedUser = PublicUser & {
  name: string | null;
  bio?: string;
  isFollower: boolean;
  post_count: number;
};

export async function addEnhancedUserData(
  user: PublicUser,
): Promise<EnhancedUser | null> {
  const { user: current_user } = await getCurrentSession();
  if (current_user === null) {
    return null;
  }

  const result = await db
    .select({ text: bios.text })
    .from(bios)
    .where(eq(bios.user_id, user.user_id))
    .limit(1);

  const bio = result.length > 0 ? result[0].text : "";

  const isFollower = await isFollowing(user.user_id, current_user.user_id);

  console.warn(
    `checking if ${current_user.username} is following ${user.username}`,
  );

  const post_count = (await getPostCount(user.user_id)) ?? 0;

  return { ...user, bio, isFollower, post_count };
}

export async function getAllUsers() {
  const { user } = await getCurrentSession();
  if (user === null) {
    return [];
  }

  const results = await db
    .select({ username: users.username, user_id: users.user_id })
    .from(users);

  return results;
}

export async function getUserByUsername(
  username: string,
  includeDetails = true,
): Promise<EnhancedUser | null> {
  const results = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (results.length === 0) {
    return null;
  }

  let user: EnhancedUser | null = null;

  if (includeDetails) {
    user = await addEnhancedUserData(results[0]);
  } else {
    // hack
    user = {
      ...results[0],
      isFollower: false,
      post_count: 0,
    };
  }

  return user;
}

export async function getUserByEmail(email: string) {
  const results = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return results[0];
}

export async function getUserByIdentifier(
  identifier: string,
): Promise<User | null> {
  const results = await db
    .select()
    .from(users)
    .where(or(eq(users.email, identifier), eq(users.username, identifier)))
    .limit(1);

  if (results.length > 0) {
    return results[0];
  }

  return null;
}

export async function getUserById(user_id: number): Promise<User | undefined> {
  const { user } = await getCurrentSession();
  if (user === null) {
    return;
  }
  const results = await db
    .select()
    .from(users)
    .where(eq(users.user_id, user_id))
    .limit(1);

  return results.length > 0 ? results[0] : undefined;
}

export async function getUserByUsernameSearch(
  query: string,
): Promise<PublicUser[]> {
  const { user } = await getCurrentSession();
  if (user === null) {
    return [];
  }

  if (query == "") {
    return [];
  }

  const results = await db
    .select()
    .from(users)
    .where(ilike(users.username, `${query}%`))
    .orderBy(desc(users.username))
    .limit(10);

  return results;
}

export type UserUpdates = {
  name: string;
  bio: string;
};

export async function updateCurrentUser(data: UserUpdates): Promise<boolean> {
  const { user } = await getCurrentSession();
  if (user === null) {
    return false;
  }

  await db
    .update(users)
    .set({ name: data.name })
    .where(eq(users.user_id, user.user_id));

  await db
    .insert(bios)
    .values({ user_id: user.user_id, text: data.bio })
    .onConflictDoUpdate({ target: bios.user_id, set: { text: data.bio } });

  return true;
}
