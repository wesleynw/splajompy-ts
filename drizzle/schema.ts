import { pgTable, foreignKey, integer, json, timestamp, bigint, boolean, unique, serial, varchar, text, jsonb, check, index, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const wrapped = pgTable("wrapped", {
	userId: integer("user_id").primaryKey().notNull(),
	content: json().notNull(),
	generated: timestamp({ mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "wrapped_user_id_fkey"
		}).onDelete("cascade"),
]);

export const schemaMigrations = pgTable("schema_migrations", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	version: bigint({ mode: "number" }).primaryKey().notNull(),
	dirty: boolean().notNull(),
});

export const users = pgTable("users", {
	userId: serial("user_id").primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	username: varchar({ length: 100 }).notNull(),
	name: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	pinnedPostId: integer("pinned_post_id"),
	isVerified: boolean("is_verified").default(false).notNull(),
	userDisplayProperties: jsonb("user_display_properties"),
	referralCode: text("referral_code").notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
	unique("users_referral_code_key").on(table.referralCode),
	unique("users_user_id_unique").on(table.userId),
]);

export const posts = pgTable("posts", {
	postId: serial("post_id").primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	text: text(),
	facets: json(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	attributes: json(),
	visibilitytype: integer().default(0).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "posts_user_id_users_user_id_fk"
		}).onDelete("cascade"),
]);

export const bios = pgTable("bios", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	text: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "bios_user_id_users_user_id_fk"
		}).onDelete("cascade"),
	unique("bios_user_id_unique").on(table.userId),
]);

export const block = pgTable("block", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	targetUserId: integer("target_user_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.targetUserId],
			foreignColumns: [users.userId],
			name: "block_target_user_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "block_user_id_fkey"
		}).onDelete("cascade"),
	unique("unique_user_target_user_id_block").on(table.targetUserId, table.userId),
	check("check_no_self_block", sql`user_id <> target_user_id`),
]);

export const comments = pgTable("comments", {
	commentId: serial("comment_id").primaryKey().notNull(),
	postId: integer("post_id").notNull(),
	userId: integer("user_id").notNull(),
	text: text().notNull(),
	facets: json(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.postId],
			foreignColumns: [posts.postId],
			name: "comments_post_id_posts_post_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "comments_user_id_users_user_id_fk"
		}).onDelete("cascade"),
]);

export const follows = pgTable("follows", {
	followerId: integer("follower_id").notNull(),
	followingId: integer("following_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.followerId],
			foreignColumns: [users.userId],
			name: "follows_follower_id_users_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.followingId],
			foreignColumns: [users.userId],
			name: "follows_following_id_users_user_id_fk"
		}).onDelete("cascade"),
	unique("follows_follower_id_following_id_unique").on(table.followerId, table.followingId),
]);

export const images = pgTable("images", {
	imageId: serial("image_id").primaryKey().notNull(),
	height: integer().notNull(),
	width: integer().notNull(),
	imageBlobUrl: text("image_blob_url").notNull(),
	postId: integer("post_id").notNull(),
	displayOrder: integer("display_order").default(0).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.postId],
			foreignColumns: [posts.postId],
			name: "images_post_id_posts_post_id_fk"
		}).onDelete("cascade"),
]);

export const likes = pgTable("likes", {
	postId: integer("post_id").notNull(),
	userId: integer("user_id").notNull(),
	commentId: integer("comment_id"),
	isPost: boolean("is_post").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.commentId],
			foreignColumns: [comments.commentId],
			name: "likes_comment_id_comments_comment_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.postId],
			foreignColumns: [posts.postId],
			name: "likes_post_id_posts_post_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "likes_user_id_users_user_id_fk"
		}).onDelete("cascade"),
	unique("likes_user_id_post_id_comment_id_is_post_unique").on(table.commentId, table.isPost, table.postId, table.userId),
]);

export const mute = pgTable("mute", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	targetUserId: integer("target_user_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.targetUserId],
			foreignColumns: [users.userId],
			name: "mute_target_user_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "mute_user_id_fkey"
		}).onDelete("cascade"),
	unique("unique_user_target_user_id_mute").on(table.targetUserId, table.userId),
	check("check_no_self_mute", sql`user_id <> target_user_id`),
]);

export const notifications = pgTable("notifications", {
	notificationId: serial("notification_id").primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	message: text().notNull(),
	link: text(),
	viewed: boolean().default(false),
	postId: integer("post_id"),
	commentId: integer("comment_id"),
	facets: json(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	notificationType: varchar("notification_type", { length: 50 }).default('default').notNull(),
	targetUserId: integer("target_user_id"),
}, (table) => [
	index("idx_notifications_user_id").using("btree", table.userId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.commentId],
			foreignColumns: [comments.commentId],
			name: "notifications_comment_id_comments_comment_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.postId],
			foreignColumns: [posts.postId],
			name: "notifications_post_id_posts_post_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "notifications_user_id_users_user_id_fk"
		}).onDelete("cascade"),
]);

export const pollVote = pgTable("poll_vote", {
	id: serial().primaryKey().notNull(),
	postId: integer("post_id").notNull(),
	userId: integer("user_id").notNull(),
	optionIndex: integer("option_index").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.postId],
			foreignColumns: [posts.postId],
			name: "poll_vote_post_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "poll_vote_user_id_fkey"
		}).onDelete("cascade"),
	unique("poll_vote_post_id_user_id_key").on(table.postId, table.userId),
]);

export const sessions = pgTable("sessions", {
	id: text().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "sessions_user_id_users_user_id_fk"
		}).onDelete("cascade"),
]);

export const verificationCodes = pgTable("verificationCodes", {
	id: serial().primaryKey().notNull(),
	code: text().notNull(),
	userId: integer("user_id").notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "verificationCodes_user_id_users_user_id_fk"
		}).onDelete("cascade"),
	unique("verificationCodes_user_id_unique").on(table.userId),
]);

export const userRelationship = pgTable("user_relationship", {
	userId: integer("user_id").notNull(),
	targetUserId: integer("target_user_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.targetUserId],
			foreignColumns: [users.userId],
			name: "user_relationship_target_user_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "user_relationship_user_id_fkey"
		}),
	primaryKey({ columns: [table.targetUserId, table.userId], name: "user_relationship_pkey"}),
]);
