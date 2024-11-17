"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

export async function insertImage(user_id: number, file: File) {
  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const client = new S3Client({
      region: process.env.SPACE_REGION!,
      endpoint: `https://${process.env.SPACE_REGION}.digitaloceanspaces.com`,
      credentials: {
        accessKeyId: process.env.SPACES_ACCESS_KEY!,
        secretAccessKey: process.env.SPACES_SECRET_KEY!,
      },
    });

    const uniqueFilename = `${process.env
      .ENVIRONMENT!}/posts/${user_id}/${uuidv4()}-${file.name}`;

    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.SPACE_NAME!,
      Key: `${uniqueFilename}`,
      Body: fileBuffer,
      ContentType: file.type,
      ACL: "public-read",
    });

    const message = await client.send(uploadCommand);
    console.log(message.$metadata.httpStatusCode);

    const fileUrl = `${uniqueFilename}`;

    return fileUrl;
  } catch (error) {
    console.error(error);
  }
}
