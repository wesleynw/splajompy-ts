"use server";

import { auth, signIn } from "@/auth";
import bcrypt from "bcryptjs";
import { registerSchema } from "./zod";
import { CredentialsSignin } from "next-auth";
import zod from "zod";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { comments, images, notifications, posts, users } from "@/db/schema";
import { eq, or, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function authenticate(_currentState: unknown, formData: FormData) {
  try {
    await signIn("credentials", formData);
  } catch (err) {
    if (err instanceof CredentialsSignin) {
      if (err.type === "CredentialsSignin") {
        return "Invalid credentials";
      } else {
        return "Something went wrong.";
      }
    }
  }
  revalidatePath("/");
  redirect("/");
}

export async function register(_currentState: unknown, formData: FormData) {
  const username = formData.get("username")?.toString() ?? "";
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  try {
    const parsedData = registerSchema.parse({ username, email, password });

    const existingUser = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.username, username)))
      .limit(1);

    if (existingUser.length > 0) {
      return "A user with this email or username already exists. Please use a different email.";
    }
    const hashedPassword = await bcrypt.hash(parsedData.password, 10);

    await db.insert(users).values({
      email: parsedData.email,
      password: hashedPassword,
      username: parsedData.username,
    });

    await signIn("credentials", {
      redirect: false,
      identifier: parsedData.email,
      password: parsedData.password,
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return error.errors.map((e) => e.message).join(", ");
    }

    return "An error occurred while registering. Please try again.";
  }

  redirect("/");
}

export async function insertImage(
  post_id: number,
  imageBlobUrl: string,
  width: number,
  height: number
) {
  await db.insert(images).values({
    post_id: post_id,
    height: height,
    width: width,
    imageBlobUrl: imageBlobUrl,
  });

  revalidatePath("/");
}

export async function insertPost(formData: FormData, includesImage: boolean) {
  const session = await auth();

  let postText: string | undefined;
  if (formData.get("text")) {
    postText = formData.get("text")?.toString();
  }

  const post = await db
    .insert(posts)
    .values({
      user_id: Number(session?.user?.user_id),
      text: postText,
    })
    .returning();

  if (!includesImage) {
    revalidatePath("/");
  }

  formData.set("text", "");
  return post[0];
}

export async function insertComment(text: string, post_id: number) {
  "use server";
  const session = await auth();
  if (!session) {
    return;
  }

  if (text) {
    const comment = await db
      .insert(comments)
      .values({
        post_id: Number(post_id),
        user_id: session?.user?.user_id,
        text: text,
      })
      .returning();

    const result = await db
      .select()
      .from(comments)
      .innerJoin(users, eq(comments.user_id, users.user_id))
      .where(eq(comments.comment_id, comment[0].comment_id))
      .limit(1);

    // notification
    await db.insert(notifications).values({
      user_id: session.user.user_id,
      message: `${session.user.username} commented on your post`,
      link: `/post/${post_id}`,
    });

    return result;
  }
}

export async function getComments(post_id: number) {
  const results = await db
    .select()
    .from(comments)
    .innerJoin(users, eq(comments.user_id, users.user_id))
    .where(eq(comments.post_id, post_id))
    .orderBy(asc(comments.comment_date));

  return results;
}

export async function getUsername(user_id: number) {
  const results = await db
    .select()
    .from(users)
    .where(eq(users.user_id, user_id))
    .limit(1);

  return results[0].username;
}
