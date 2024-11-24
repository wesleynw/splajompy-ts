ALTER TABLE "follows" DROP COLUMN IF EXISTS "follow_id";--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_following_id_unique" UNIQUE("follower_id","following_id");