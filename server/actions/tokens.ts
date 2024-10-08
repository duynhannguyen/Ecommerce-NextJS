"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import {
  emailTokens,
  passwordResetToken,
  twoFactorTokens,
  users,
} from "../schema";
import crypto from "crypto";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.query.emailTokens.findFirst({
      where: eq(emailTokens.email, email),
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

const generateEmailVerificationToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const exitstingToken = await getVerificationTokenByEmail(email);
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

  if (!exitstingToken) return { error: "Token not found" };
  const hasExpired = new Date(exitstingToken.expires) < new Date();
  if (hasExpired) return { error: "Token has expired" };
  const exitstingUser = await db.query.users.findFirst({
    where: eq(users.email, exitstingToken.email),
  });
  if (!exitstingUser) return { error: "Email does not exist" };

  await db
    .update(users)
    .set({
      emailVerified: new Date(),
      email: exitstingToken.email,
    })
    .where(eq(users.id, exitstingUser.id));
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

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = db.query.twoFactorTokens.findFirst({
      where: eq(twoFactorTokens.email, email),
    });
    return twoFactorToken;
  } catch (error) {
    return null;
  }
};

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await db.query.twoFactorTokens.findFirst({
      where: eq(twoFactorTokens.token, token),
    });

    return twoFactorToken;
  } catch (error) {
    return null;
  }
};

export const generateTwoFactorToken = async (email: string) => {
  try {
    const token = crypto.randomInt(100_000, 1_000_000).toString();

    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const exitstingToken = await getTwoFactorTokenByEmail(email);
    if (exitstingToken) {
      await db
        .delete(twoFactorTokens)
        .where(eq(twoFactorTokens.id, exitstingToken.id));
    }
    const twoFactorToken = await db
      .insert(twoFactorTokens)
      .values({
        email,
        token,
        expires,
      })
      .returning();
    return twoFactorToken;
  } catch (error) {
    return null;
  }
};
