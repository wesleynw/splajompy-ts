import { relations } from "drizzle-orm/relations";
import { users, posts } from "./schema";

export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.user_id],
    references: [users.user_id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));
