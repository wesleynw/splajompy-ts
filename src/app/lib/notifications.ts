"use server";

import { db } from "@/db";
import { eq, and, desc } from "drizzle-orm";
import { notifications } from "@/db/schema";
import { auth } from "@/auth";

export async function getCurrentUserHasUnreadNotifications() {
  const session = await auth();

  if (!session?.user) {
    return false;
  }

  const result = await db
    .select()
    .from(notifications)
    .where(
      and(
        eq(notifications.user_id, session.user.user_id),
        eq(notifications.viewed, false)
      )
    )
    .limit(1);

  return result.length > 0;
}

export async function getNotifications() {
  const session = await auth();

  if (!session?.user) {
    return [];
  }

  const result = await db
    .select()
    .from(notifications)
    .where(eq(notifications.user_id, session.user.user_id))
    .orderBy(desc(notifications.notification_id));

  return result;
}

export async function markAllNotificationAsRead() {
  const session = await auth();

  if (!session?.user) {
    return;
  }

  await db
    .update(notifications)
    .set({ viewed: true })
    .where(eq(notifications.user_id, session.user.user_id));
}
