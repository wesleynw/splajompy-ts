CREATE TABLE IF NOT EXISTS "notifications" (
	"notification_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"message" text NOT NULL,
	"link" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "notifications_user_id_message_unique" UNIQUE("user_id","message")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
