"use server";

import { db } from "@/db";
import { eq, and, desc, count } from "drizzle-orm";
import { notifications } from "@/db/schema";

export async function getUnreadNotificationCountForUser(user_id: number) {
  const result = await db
    .select({ count: count() })
    .from(notifications)
    .where(
      and(eq(notifications.user_id, user_id), eq(notifications.viewed, false))
    );

  return result[0].count;
}

export async function getNotificationsForUser(user_id: number) {
  const result = await db
    .select()
    .from(notifications)
    .where(eq(notifications.user_id, user_id))
    .orderBy(desc(notifications.notification_id));

  return result;
}

export async function setNotificationAsViewedForUser(user_id: number) {
  await db
    .update(notifications)
    .set({ viewed: true })
    .where(eq(notifications.user_id, user_id));
}
