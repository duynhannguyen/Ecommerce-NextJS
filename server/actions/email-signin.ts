"use server";
import { LoginSchema } from "@/types/login-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "@/server/index";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import generateEmailVerificationToken from "./tokens";
import sendVerificationEmail from "./email";
import { signIn } from "../auth";
import { AuthError } from "next-auth";

const action = createSafeActionClient();

export const emailSignIn = action
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    try {
      const exitstingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (exitstingUser?.email !== email) {
        return { error: "Email not found" };
      }

      if (!exitstingUser?.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email);
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );
        return { success: "Confirmation Email Sent!" };
      }
      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      });

      return { success: "User Signed In" };
    } catch (error) {
      if (error instanceof AuthError) {
        console.log("error", error);
        switch (error.type) {
          case "AccessDenied":
            return { error: error.message };
          case "OAuthSignInError":
            return { error: error.message };
          case "CallbackRouteError":
            return { error: "Email or password is incorrect" };
          default:
            return { error: "Something went wrong" };
        }
      }
      throw error;
    }
  });
