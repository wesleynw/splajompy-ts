CREATE TABLE IF NOT EXISTS "likes" (
	"post_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "likes_post_id_user_id_unique" UNIQUE("post_id","user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likes" ADD CONSTRAINT "likes_post_id_posts_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("post_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
