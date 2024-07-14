"use client";

import { newVerification } from "@/server/actions/tokens";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import AuthCard from "./auth-card";
import FormSuccess from "./form-success";
import FormError from "./form-error";

const EmailVerificationForm = () => {
  const email = useSearchParams().get("email");
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleVerification = useCallback(() => {
    if (success || error) return;
    if (!email) {
      setError("Email not found");
      return;
    }
    newVerification(email).then((data) => {
      if (data.error) {
        setError(data.error);
      }
      if (data.success) {
        setSuccess(data.success);
        router.push("/auth/login");
      }
    });
  }, []);

  useEffect(() => {
    handleVerification();
  }, []);

  return (
    <AuthCard
      cardTitle="Verify your account"
      BackButtonLabel="Back to login"
      BackButtonHref="/auth/login"
      showSocials={false}
    >
      <div className="flex items-center flex-col w-full justify-center ">
        <p> {!success && !error ? "Verifying email" : null} </p>
      </div>
      <FormSuccess message={success} />
      <FormError message={error} />
    </AuthCard>
  );
};

export default EmailVerificationForm;
