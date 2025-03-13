"use server";

import { db } from "@/db";
import { images } from "@/db/schema";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function getPresignedUrl(
  user_id: number,
  contentType: string,
  fileName: string,
) {
  try {
    const client = new S3Client({
      region: process.env.SPACE_REGION!,
      endpoint: `https://${process.env.SPACE_REGION}.digitaloceanspaces.com`,
      credentials: {
        accessKeyId: process.env.SPACES_ACCESS_KEY!,
        secretAccessKey: process.env.SPACES_SECRET_KEY!,
      },
    });

    const extension = fileName.substring(fileName.lastIndexOf(".") + 1);

    const uniqueFilename = `${process.env
      .ENVIRONMENT!}/posts/${user_id}/${uuidv4()}.${extension}`;

    const { url, fields } = await createPresignedPost(client, {
      Bucket: process.env.SPACE_NAME!,
      Key: `${uniqueFilename}`,
      Fields: {
        acl: "public-read",
        ContentType: contentType,
      },
    });

    return { url, fields, uniqueFilename };
  } catch (error) {
    console.error(error);
  }
}

export async function deleteObjects(post_id: number) {
  try {
    const result = await db
      .select({ imageBlobUrl: images.imageBlobUrl })
      .from(images)
      .where(eq(images.post_id, post_id));

    if (!result?.[0]) {
      return;
    }

    const key = result[0].imageBlobUrl;

    const client = new S3Client({
      region: process.env.SPACE_REGION!,
      endpoint: `https://${process.env.SPACE_REGION}.digitaloceanspaces.com`,
      credentials: {
        accessKeyId: process.env.SPACES_ACCESS_KEY!,
        secretAccessKey: process.env.SPACES_SECRET_KEY!,
      },
    });

    await client.send(
      new DeleteObjectCommand({ Bucket: process.env.SPACE_NAME!, Key: key }),
    );
  } catch (error) {
    console.error(error);
  }
}
