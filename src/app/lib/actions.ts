"use server";

import { signIn } from "@/auth";
import bcrypt from "bcryptjs";
import { registerSchema } from "./zod";
import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";
import { CredentialsSignin } from "next-auth";

export async function authenticate(_currentState: unknown, formData: FormData) {
  try {
    await signIn("credentials", formData);
  } catch (err) {
    if (err instanceof CredentialsSignin) {
      switch (err.type) {
        case "CredentialsSignin":
          return "Invalid credentials";
        default:
          return "Something went wrong.";
      }
    }
  }
}

export async function register(_currentState: unknown, formData: FormData) {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  console.log("registering with password: ", password);

  // Validate input using Zod
  const parsedData = registerSchema.parse({ email, password });

  // Hash the password
  const hashedPassword = await bcrypt.hash(parsedData.password, 10);

  console.log("hashed: ", hashedPassword);

  // Insert user into Vercel Postgres
  try {
    await sql`
    INSERT INTO users (email, password)
    VALUES (${parsedData.email}, ${hashedPassword});
  `;
  } catch (error) {
    console.error(error);
  }

  // Redirect to a success page or login
  redirect("/login");
  return "lol";
}
