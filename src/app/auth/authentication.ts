"use server";

import { signInSchema } from "../lib/zod";
import bcrypt from "bcryptjs";
import { getUserByIdentifier } from "../lib/users";
import { createSession, generateSessionToken } from "./session";
import { setSessionTokenCookie } from "./cookies";
import { formatErrors } from "../lib/utils";

export type AuthResult = {
  errors?: Record<string, string>;
  payload?: FormData;
};

export async function authorize(
  _currentState: unknown,
  formData: FormData
): Promise<AuthResult> {
  const result = await signInSchema.safeParseAsync({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!result.success) {
    const formattedErrors = formatErrors(result);

    return {
      errors: formattedErrors,
      payload: formData,
    };
  }

  const identifier = result.data.identifier;
  const password = result.data.password;

  const user = await getUserByIdentifier(identifier);
  if (user != null) {
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return {
        errors: { password: "Incorrect password" },
        payload: formData,
      };
    }
  } else {
    return {
      errors: { identifier: "User not found" },
      payload: formData,
    };
  }

  const token = await generateSessionToken();
  const session = await createSession(token, user.user_id);
  await setSessionTokenCookie(token, session.expiresAt);
  return { payload: formData };
}
