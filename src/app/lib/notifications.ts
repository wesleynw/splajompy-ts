"use server";

import { db } from "@/db";
import { Comment, NotificationData, notifications } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { getCurrentSession } from "../auth/session";
import { PostType } from "../data/posts";
import { toMentionInternalFormat } from "../utils/mentions-serverside";
import { getCommentById } from "./comments";
import { getPostById } from "./posts";
import { getUserById } from "./users";

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

export type ExtendedNotificationData = NotificationData & {
  post: PostType | undefined;
  comment: Comment | undefined;
};

export async function fetchNotifications(
  offset: number = 0,
): Promise<ExtendedNotificationData[]> {
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

  const notificationsWithDetails = await Promise.all(
    results.map(async (notification) => {
      let post: PostType | undefined = undefined;
      let comment: Comment | undefined = undefined;

      if (notification.comment_id) {
        comment = await getCommentById(notification.comment_id);
      } else if (notification.post_id) {
        post = await getPostById(notification.post_id);
      }

      return {
        ...notification,
        post,
        comment,
      };
    }),
  );

  return notificationsWithDetails;
}

export async function markAllNotificationAsRead() {
  console.log("a");
  const { user } = await getCurrentSession();
  if (user === null) {
    return;
  }

  console.log("aaa");

  await db
    .update(notifications)
    .set({ viewed: true })
    .where(eq(notifications.user_id, user.user_id));
}

export async function markNotificationAsRead(notification_id: number) {
  const { user } = await getCurrentSession();
  if (user === null) {
    return;
  }

  await db
    .update(notifications)
    .set({ viewed: true })
    .where(eq(notifications.notification_id, notification_id));
}

type SendNotificationKwargs = {
  target_user_id: number;
  post_id?: number;
  comment_id?: number;
  message: string;
};

export async function sendNotification(
  args: SendNotificationKwargs,
): Promise<void> {
  const { user } = await getCurrentSession();
  if (user === null) {
    return;
  }

  const target_user = await getUserById(args.target_user_id);
  if (!target_user) {
    return;
  }

  const message = `${toMentionInternalFormat(user.user_id, user.username)} ${args.message}`;

  await db.insert(notifications).values({
    user_id: args.target_user_id,
    post_id: args.post_id,
    comment_id: args.comment_id,
    message: message,
    link: `/post/${args.post_id}`,
  });
}
