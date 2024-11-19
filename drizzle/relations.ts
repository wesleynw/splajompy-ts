import { relations } from "drizzle-orm/relations";
import { posts, comments, users, images } from "./schema";

export const commentsRelations = relations(comments, ({one}) => ({
	post: one(posts, {
		fields: [comments.postId],
		references: [posts.postId]
	}),
	user: one(users, {
		fields: [comments.userId],
		references: [users.userId]
	}),
}));

export const postsRelations = relations(posts, ({one, many}) => ({
	comments: many(comments),
	user: one(users, {
		fields: [posts.userId],
		references: [users.userId]
	}),
	images: many(images),
}));

export const usersRelations = relations(users, ({many}) => ({
	comments: many(comments),
	posts: many(posts),
}));

export const imagesRelations = relations(images, ({one}) => ({
	post: one(posts, {
		fields: [images.postId],
		references: [posts.postId]
	}),
}));