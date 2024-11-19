ALTER TABLE "posts" DROP CONSTRAINT "posts_image_id_images_image_id_fk";
--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "post_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images" ADD CONSTRAINT "images_post_id_posts_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("post_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN IF EXISTS "image_id";