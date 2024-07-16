"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import { emailTokens, passwordResetToken, users } from "../schema";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.query.emailTokens.findFirst({
      where: eq(emailTokens.email, email),
    });
    console.log("verificationToken in token.ts ", verificationToken);
    return verificationToken;
  } catch (error) {
    return null;
  }
};

const generateEmailVerificationToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const exitstingToken = await getVerificationTokenByEmail(email);
  console.log("exitstingToken in token.ts", exitstingToken);
  if (exitstingToken) {
    await db.delete(emailTokens).where(eq(emailTokens.id, exitstingToken.id));
  }

  const verificationToken = await db
    .insert(emailTokens)
    .values({
      email,
      token,
      expires,
    })
    .returning();

  return verificationToken;
};

export default generateEmailVerificationToken;

export const newVerification = async (email: string) => {
  const exitstingToken = await getVerificationTokenByEmail(email);
  console.log("exitstingToken", exitstingToken);

  if (!exitstingToken) return { error: "Token not found" };
  const hasExpired = new Date(exitstingToken.expires) < new Date();
  if (hasExpired) return { error: "Token has expired" };
  const exitstingUser = await db.query.users.findFirst({
    where: eq(users.email, exitstingToken.email),
  });
  if (!exitstingUser) return { error: "Email does not exist" };

  await db.update(users).set({
    emailVerified: new Date(),
    email: exitstingToken.email,
  });
  await db.delete(emailTokens).where(eq(emailTokens.id, exitstingToken.id));

  return { success: "Email Verified" };
};

export const getPasswordRestTokenByToken = async (token: string) => {
  try {
    const exitstingToken = await db.query.passwordResetToken.findFirst({
      where: eq(passwordResetToken.token, token),
    });

    return exitstingToken;
  } catch (error) {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const resetToken = db.query.passwordResetToken.findFirst({
      where: eq(passwordResetToken.email, email),
    });
    return resetToken;
  } catch (error) {
    return null;
  }
};

export const generatePasswordResetToken = async (email: string) => {
  try {
    const token = crypto.randomUUID();

    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const exitstingToken = await getPasswordResetTokenByEmail(email);
    if (exitstingToken) {
      await db
        .delete(passwordResetToken)
        .where(eq(passwordResetToken.id, exitstingToken.id));
    }
    const passwordResetTokens = await db
      .insert(passwordResetToken)
      .values({
        email,
        token,
        expires,
      })
      .returning();
    return passwordResetTokens;
  } catch (error) {
    return null;
  }
};
