import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./app/lib/zod";
import { getUserPWHashFromDb } from "@/utils/db";
import bcrypt from "bcryptjs";
import { User } from "./types/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials): Promise<User | null> => {
        try {
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          const user = await getUserPWHashFromDb(email);

          if (user !== null) {
            const match = await bcrypt.compare(password, user.password);

            console.log(match);

            if (!match) {
              throw new Error("User not found.");
            }
            return user;
          }
        } catch {
          // catch zod errors
          return null;
        }
        return null;
      },
    }),
  ],
});
