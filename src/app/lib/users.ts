"use server";

import { db } from "@/db";
import { PublicUser, User, users } from "@/db/schema";
import { desc, eq, ilike, or } from "drizzle-orm";
import { getCurrentSession } from "../auth/session";

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

export async function getUserByUsername(username: string) {
  const results = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  return results[0];
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
