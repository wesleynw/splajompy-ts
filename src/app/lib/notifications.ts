"use server";

import { db } from "@/db";
import { eq, and, desc } from "drizzle-orm";
import { notifications } from "@/db/schema";
import { getCurrentSession } from "../auth/session";

export async function getCurrentUserHasUnreadNotifications() {
  const { user } = await getCurrentSession();
  if (user === null) {
    return false;
  }

  const result = await db
    .select()
    .from(notifications)
    .where(
      and(
        eq(notifications.user_id, user.user_id),
        eq(notifications.viewed, false)
      )
    )
    .limit(1);

  return result.length > 0;
}

export async function getNotifications() {
  const { user } = await getCurrentSession();
  if (user === null) {
    return [];
  }

  const result = await db
    .select()
    .from(notifications)
    .where(eq(notifications.user_id, user.user_id))
    .orderBy(desc(notifications.notification_id));

  return result;
}

export async function markAllNotificationAsRead() {
  const { user } = await getCurrentSession();
  if (user === null) {
    return;
  }

  await db
    .update(notifications)
    .set({ viewed: true })
    .where(eq(notifications.user_id, user.user_id));
}
