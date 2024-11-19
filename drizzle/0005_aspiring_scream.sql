CREATE TABLE IF NOT EXISTS "images" (
	"image_id" serial PRIMARY KEY NOT NULL,
	"height" integer NOT NULL,
	"width" integer NOT NULL,
	"imageBlobUrl" text
);
--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "image_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_image_id_images_image_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("image_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN IF EXISTS "imageBlobUrl";