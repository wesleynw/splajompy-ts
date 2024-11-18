"use server";

import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { v4 as uuidv4 } from "uuid";

export async function getPresignedUrl(user_id: number) {
  try {
    const client = new S3Client({
      region: process.env.SPACE_REGION!,
      endpoint: `https://${process.env.SPACE_REGION}.digitaloceanspaces.com`,
      credentials: {
        accessKeyId: process.env.SPACES_ACCESS_KEY!,
        secretAccessKey: process.env.SPACES_SECRET_KEY!,
      },
    });

    const uniqueFilename = `${process.env
      .ENVIRONMENT!}/posts/${user_id}/${uuidv4()}`;

    const { url, fields } = await createPresignedPost(client, {
      Bucket: process.env.SPACE_NAME!,
      Key: `${uniqueFilename}`,
      Fields: {
        acl: "public-read",
      },
    });

    return { url, fields, uniqueFilename };
  } catch (error) {
    console.error(error);
  }
}
