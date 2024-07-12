"use server";
import { LoginSchema } from "@/types/login-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "@/server/index";
import { eq } from "drizzle-orm";
import { users } from "../schema";

const action = createSafeActionClient();

export const emailSignIn = action
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    const exitstingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (exitstingUser?.email !== email) {
      return { error: "Email not found" };
    }

    // if(!exitstingUser?.emailVerified){

    // }

    return { success: email };
  });
