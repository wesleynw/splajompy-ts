import { pgTable, foreignKey, serial, integer, varchar, timestamp, unique, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const comments = pgTable("comments", {
	commentId: serial("comment_id").primaryKey().notNull(),
	postId: integer("post_id").notNull(),
	userId: integer("user_id").notNull(),
	text: varchar({ length: 255 }).notNull(),
	commentDate: timestamp("comment_date", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
	return {
		commentsPostIdPostsPostIdFk: foreignKey({
			columns: [table.postId],
			foreignColumns: [posts.postId],
			name: "comments_post_id_posts_post_id_fk"
		}).onDelete("cascade"),
		commentsUserIdUsersUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "comments_user_id_users_user_id_fk"
		}).onDelete("cascade"),
	}
});

export const users = pgTable("users", {
	userId: serial("user_id").primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	username: varchar({ length: 100 }).notNull(),
}, (table) => {
	return {
		usersUserIdUnique: unique("users_user_id_unique").on(table.userId),
		usersEmailUnique: unique("users_email_unique").on(table.email),
	}
});

export const posts = pgTable("posts", {
	postId: serial("post_id").primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	text: text(),
	postdate: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => {
	return {
		postsUserIdUsersUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "posts_user_id_users_user_id_fk"
		}).onDelete("cascade"),
	}
});

export const likes = pgTable("likes", {
	postId: integer("post_id").notNull(),
	userId: integer("user_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
	return {
		likesPostIdPostsPostIdFk: foreignKey({
			columns: [table.postId],
			foreignColumns: [posts.postId],
			name: "likes_post_id_posts_post_id_fk"
		}).onDelete("cascade"),
		likesUserIdUsersUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "likes_user_id_users_user_id_fk"
		}).onDelete("cascade"),
		likesPostIdUserIdUnique: unique("likes_post_id_user_id_unique").on(table.postId, table.userId),
	}
});

export const images = pgTable("images", {
	imageId: serial("image_id").primaryKey().notNull(),
	height: integer().notNull(),
	width: integer().notNull(),
	imageBlobUrl: text().notNull(),
	postId: integer("post_id").notNull(),
}, (table) => {
	return {
		imagesPostIdPostsPostIdFk: foreignKey({
			columns: [table.postId],
			foreignColumns: [posts.postId],
			name: "images_post_id_posts_post_id_fk"
		}).onDelete("cascade"),
	}
});

export const follows = pgTable("follows", {
	followerId: integer("follower_id").notNull(),
	followingId: integer("following_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
	return {
		followsFollowerIdUsersUserIdFk: foreignKey({
			columns: [table.followerId],
			foreignColumns: [users.userId],
			name: "follows_follower_id_users_user_id_fk"
		}).onDelete("cascade"),
		followsFollowingIdUsersUserIdFk: foreignKey({
			columns: [table.followingId],
			foreignColumns: [users.userId],
			name: "follows_following_id_users_user_id_fk"
		}).onDelete("cascade"),
		followsFollowerIdFollowingIdUnique: unique("follows_follower_id_following_id_unique").on(table.followerId, table.followingId),
	}
});
