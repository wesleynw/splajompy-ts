"use server";

import { db } from "@/db";
import { Session, sessions, User, users } from "@/db/schema";
import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { cache } from "react";

export async function generateSessionToken(): Promise<string> {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(
  token: string,
  user_id: number,
): Promise<Session> {
  const session_id = encodeHexLowerCase(
    sha256(new TextEncoder().encode(token)),
  );
  const session: Session = {
    id: session_id,
    user_id: user_id,
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };

  await db.insert(sessions).values(session);
  return session;
}

async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const session_id = encodeHexLowerCase(
    sha256(new TextEncoder().encode(token)),
  );
  const result = await db
    .select({ user: users, session: sessions })
    .from(sessions)
    .innerJoin(users, eq(sessions.user_id, users.user_id))
    .where(eq(sessions.id, session_id));

  if (result.length < 1) {
    return { session: null, user: null };
  }
  const { user, session } = result[0];
  if (Date.now() >= session.expires_at.getTime()) {
    await db.delete(sessions).where(eq(sessions.id, token));
    return { session: null, user: null };
  }
  if (Date.now() >= session.expires_at.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await db
      .update(sessions)
      .set({
        expires_at: session.expires_at,
      })
      .where(eq(sessions.id, session.id));
  }
  return { session, user };
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

export async function invalidateSession(session_id: string) {
  await db.delete(sessions).where(eq(sessions.id, session_id));
}

export const getCurrentSession = cache(
  async (): Promise<SessionValidationResult> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value ?? null;
    if (token === null) {
      return { session: null, user: null };
    }
    const result = await validateSessionToken(token);
    return result;
  },
);
