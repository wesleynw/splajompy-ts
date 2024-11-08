import { db } from "@/db";
import { SelectUser, users } from "@/db/schema";
import { eq, or } from "drizzle-orm";

export async function getUserPWHashFromDb(
  identifier: string
): Promise<SelectUser | null> {
  try {
    const result = await db
      .select()
      .from(users)
      .where(or(eq(users.email, identifier), eq(users.username, identifier)))
      .limit(1);

    if (result.length === 0) return null;

    return result[0];
  } catch {
    throw new Error("Failed to query the database");
  }
}
