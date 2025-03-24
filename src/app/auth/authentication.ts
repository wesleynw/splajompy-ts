"use server";

import { db } from "@/db";
import { verificationCodes } from "@/db/schema";
import bcrypt from "bcryptjs";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { sendSignInCodeEmail } from "../lib/emails";
import { getUserByIdentifier } from "../lib/users";
import { formatErrors } from "../lib/utils";
import { identifierSchema, otpSchema, signInSchema } from "../lib/zod";
import { setSessionTokenCookie } from "./cookies";
import { createSession, generateSessionToken } from "./session";

export type AuthResult = {
  errors?: Record<string, string>;
  payload?: FormData;
  useOtp?: boolean;
};

export async function authorize(
  _currentState: unknown,
  formData: FormData,
): Promise<AuthResult> {
  if (formData.get("password") == null) {
    return setupPasswordlessSignIn(formData);
  }

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
  await setSessionTokenCookie(token, session.expires_at);
  redirect("/");
}

async function setupPasswordlessSignIn(formData: FormData) {
  const result = await identifierSchema.safeParseAsync({
    identifier: formData.get("identifier"),
  });

  if (!result.success) {
    const formattedErrors = formatErrors(result);

    return {
      errors: formattedErrors,
      payload: formData,
    };
  }

  const identifier = result.data.identifier;

  const user = await getUserByIdentifier(identifier);
  if (user == null) {
    return {
      errors: { identifier: "User not found" },
      payload: formData,
    };
  }

  const code = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");

  await db
    .insert(verificationCodes)
    .values({
      code: code,
      user_id: user.user_id,
      expires_at: new Date(Date.now() + 5 * 60 * 1000),
    })
    .onConflictDoUpdate({
      target: verificationCodes.user_id,
      set: { code: code, expires_at: new Date(Date.now() + 5 * 60 * 1000) },
    });

  await sendSignInCodeEmail(user.email, code);

  return { useOtp: true };
}

export async function verifyPasswordlessCode(
  _currentState: unknown,
  formData: FormData,
) {
  const result = await otpSchema.safeParseAsync({
    identifier: formData.get("identifier"),
    code: formData.get("code"),
  });

  if (!result.success) {
    const formattedErrors = formatErrors(result);

    return {
      errors: formattedErrors,
      payload: formData,
    };
  }

  const identifier = result.data.identifier;
  const code = result.data.code;

  const user = await getUserByIdentifier(identifier);
  if (!user) {
    return;
  }

  const dbResult = await db
    .select()
    .from(verificationCodes)
    .where(
      and(
        eq(verificationCodes.user_id, user?.user_id),
        eq(verificationCodes.code, code),
      ),
    );

  if (dbResult.length < 1) {
    return {
      errors: { code: "This code is invalid." },
      payload: formData,
    };
  }

  if (dbResult[0].expires_at < new Date()) {
    return {
      errors: { code: "This code is expired." },
      payload: formData,
    };
  }

  await db
    .delete(verificationCodes)
    .where(eq(verificationCodes.user_id, user.user_id));

  const token = await generateSessionToken();
  const session = await createSession(token, user.user_id);
  await setSessionTokenCookie(token, session.expires_at);
  redirect("/");
}
