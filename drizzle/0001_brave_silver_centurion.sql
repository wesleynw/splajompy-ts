ALTER TABLE "likes" DROP CONSTRAINT "likes_post_id_user_id_unique";--> statement-breakpoint
ALTER TABLE "likes" ADD COLUMN "comment_id" integer;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_comment_id_comments_comment_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("comment_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_post_id_comment_id_unique" UNIQUE("user_id","post_id","comment_id");