import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import { db } from "@/server";
import Credentials from "@auth/core/providers/credentials";
import { LoginSchema } from "@/types/login-schema";
import { eq } from "drizzle-orm";
import { users } from "./schema";
import bcrypt from "bcrypt";

export const { handlers, signOut, signIn, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Github({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      authorize: async (credentials) => {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await db.query.users.findFirst({
            where: eq(users.email, email),
          });
          if (!user || !user.password) return null;
          const matchPassword = await bcrypt.compare(password, user.password);
          if (matchPassword) {
            return user;
          }
        }

        return null;
      },
    }),
  ],
});
