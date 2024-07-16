"use server";
import getBaseURL from "@/lib/base-url";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_APIKEY);
const domain = getBaseURL();
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-password?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Buyme - Reset Password Email",
    html: `<p>Click to <a href='${confirmLink}'>reset your password </a>  </p>`,
  });

  if (error) {
    return console.log(error);
  }
  if (data) return data;
};

const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?email=${email}`;
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Buyme - Confirmation Email",
    html: `<p>Click to <a href='${confirmLink}'>confirm your email </a>  </p>`,
  });

  if (error) {
    return console.log(error);
  }
  if (data) return data;
};

export default sendVerificationEmail;
