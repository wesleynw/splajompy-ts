"use server";

import { getCurrentSession } from "../auth/session";
import { getObjectPresignedUrl } from "./s3";

export async function getImageUrl(imagePath: string) {
  const { user } = await getCurrentSession();
  if (!user) {
    return null;
  }

  return getObjectPresignedUrl(imagePath);
}
