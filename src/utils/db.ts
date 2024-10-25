import { UserWithPassword } from "@/types/user";
import { sql } from "@vercel/postgres";

export async function getUserPWHashFromDb(
  identifier: string
): Promise<UserWithPassword | null> {
  console.log(identifier);
  try {
    const result = await sql<UserWithPassword>`
            SELECT *
            FROM users
            WHERE email = ${identifier} OR username = ${identifier}
            LIMIT 1;
        `;

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch {
    throw new Error("Failed to query the database");
  }
}
