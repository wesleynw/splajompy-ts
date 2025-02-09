"use server";

import { db } from "@/db";
import { NotificationData, notifications } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { getCurrentSession } from "../auth/session";

const FETCH_LIMIT = 10;

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
        eq(notifications.viewed, false),
      ),
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

export async function fetchNotifications(
  offset: number = 0,
): Promise<NotificationData[]> {
  const { user } = await getCurrentSession();
  if (user === null) {
    return [];
  }

  const results = await db
    .select()
    .from(notifications)
    .where(eq(notifications.user_id, user.user_id))
    .orderBy(desc(notifications.created_at))
    .offset(offset)
    .limit(FETCH_LIMIT);

  return results;
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
