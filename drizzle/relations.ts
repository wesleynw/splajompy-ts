import { relations } from "drizzle-orm/relations";
import { posts, comments, users, follows, images } from "./schema";

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
	follows_followerId: many(follows, {
		relationName: "follows_followerId_users_userId"
	}),
	follows_followingId: many(follows, {
		relationName: "follows_followingId_users_userId"
	}),
	posts: many(posts),
}));

export const followsRelations = relations(follows, ({one}) => ({
	user_followerId: one(users, {
		fields: [follows.followerId],
		references: [users.userId],
		relationName: "follows_followerId_users_userId"
	}),
	user_followingId: one(users, {
		fields: [follows.followingId],
		references: [users.userId],
		relationName: "follows_followingId_users_userId"
	}),
}));

export const imagesRelations = relations(images, ({one}) => ({
	post: one(posts, {
		fields: [images.postId],
		references: [posts.postId]
	}),
}));