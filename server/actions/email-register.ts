"use server";

import { RegisterSchema } from "@/types/register-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import generateEmailVerificationToken from "./tokens";
import sendVerificationEmail from "./email";

const action = createSafeActionClient();

export const EmailRegister = action
  .schema(RegisterSchema)
  .action(async ({ parsedInput: { email, password, name } }) => {
    const exitstingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    const hashedPassword = await bcrypt.hash(password, 10);

    if (exitstingUser) {
      if (!exitstingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email);
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );
        return { success: "Email Confirmation resent" };
      }
      return { error: "Email already in use " };
    }

    await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
    });

    const verificationToken = await generateEmailVerificationToken(email);
    await sendVerificationEmail(
      verificationToken[0].email,
      verificationToken[0].token
    );
    return { success: " Confirmation Email Sent! " };
  });
