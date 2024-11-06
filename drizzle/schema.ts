import { pgTable, unique, serial, varchar, foreignKey, integer, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	username: varchar({ length: 100 }).notNull(),
}, (table) => {
	return {
		usersEmailKey: unique("users_email_key").on(table.email),
		usersUsernameKey: unique("users_username_key").on(table.username),
	}
});

export const posts = pgTable("posts", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	text: varchar({ length: 255 }).notNull(),
	postdate: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
	return {
		postsUserIdFkey: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "posts_user_id_fkey"
		}).onDelete("cascade"),
	}
});
