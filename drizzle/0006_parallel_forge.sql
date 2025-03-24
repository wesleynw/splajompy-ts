ALTER TABLE "comments" RENAME COLUMN "comment_date" TO "created_at";--> statement-breakpoint
ALTER TABLE "images" RENAME COLUMN "imageBlobUrl" TO "image_blob_url";--> statement-breakpoint
ALTER TABLE "images" RENAME COLUMN "displayOrder" TO "display_order";--> statement-breakpoint
ALTER TABLE "posts" RENAME COLUMN "postdate" TO "created_at";--> statement-breakpoint
ALTER TABLE "sessions" RENAME COLUMN "expiresAt" TO "expires_at";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "created" TO "created_at";--> statement-breakpoint
ALTER TABLE "verificationCodes" RENAME COLUMN "expiresAt" TO "expires_at";