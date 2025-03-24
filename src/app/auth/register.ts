"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getUserByEmail, getUserByUsername } from "../lib/users";
import { formatErrors } from "../lib/utils";
import { registerSchema } from "../lib/zod";
import { setSessionTokenCookie } from "./cookies";
import { createSession, generateSessionToken } from "./session";

export type RegisterResult = {
  errors?: Record<string, string>;
  payload?: FormData;
};

export async function register(
  _currentState: unknown,
  formData: FormData,
): Promise<RegisterResult> {
  const result = await registerSchema.safeParseAsync({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    const formattedErrors = formatErrors(result);

    return { errors: formattedErrors, payload: formData };
  }

  const username = result.data.username;
  const email = result.data.email;
  const password = result.data.password;

  const existingUsername = await getUserByUsername(username);
  if (existingUsername != null) {
    return {
      errors: { username: "This username is taken." },
      payload: formData,
    };
  }

  const existingEmail = await getUserByEmail(email);
  if (existingEmail != null) {
    return {
      errors: { email: "An account exists with this email." },
      payload: formData,
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await db
    .insert(users)
    .values({
      email: email,
      password: hashedPassword,
      username: username,
    })
    .returning();

  const token = await generateSessionToken();
  const session = await createSession(token, newUser[0].user_id);
  await setSessionTokenCookie(token, session.expires_at);

  redirect("/");
}
