import { db } from "@/db";
import { users } from "@/db/schema";
import { UserWithPassword } from "@/types/user";
import { eq, or } from "drizzle-orm";

export async function getUserPWHashFromDb(
  identifier: string
): Promise<UserWithPassword | null> {
  try {
    const result = await db
      .select()
      .from(users)
      .where(or(eq(users.email, identifier), eq(users.username, identifier)))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch {
    throw new Error("Failed to query the database");
  }
}
