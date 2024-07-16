"use server";

import { newPasswordSchema } from "@/types/new-password-schema";
import { createSafeActionClient } from "next-safe-action";
import { getPasswordRestTokenByToken } from "./tokens";
import { db } from "..";
import { eq } from "drizzle-orm";
import { passwordResetToken, users } from "../schema";
import bcrypt from "bcrypt";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
const action = createSafeActionClient();

const newPassword = action
  .schema(newPasswordSchema)
  .action(async ({ parsedInput: { password, token } }) => {
    const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
    const dbPool = drizzle(pool);

    if (!token) {
      return { error: "Token is required" };
    }

    const exitstingToken = await getPasswordRestTokenByToken(token);
    if (!exitstingToken) {
      return { error: "Token not found" };
    }
    const hasExpired = new Date(exitstingToken.expires) < new Date();
    if (hasExpired) {
      return { error: "Token has expired" };
    }

    const exitstingUser = await db.query.users.findFirst({
      where: eq(users.email, exitstingToken.email),
    });
    if (!exitstingUser) {
      return { error: "Email not found" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await dbPool.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          password: hashedPassword,
        })
        .where(eq(users.id, exitstingUser.id));

      await tx
        .delete(passwordResetToken)
        .where(eq(passwordResetToken.id, exitstingToken.id));
    });
    return { success: "Password Updated" };
  });

export default newPassword;
