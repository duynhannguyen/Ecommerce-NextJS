"use client";

import AuthCard from "./auth-card";

const LoginForm = () => {
  return (
    <AuthCard
      cardTitle="Welcome back"
      BackButtonHref="/auth/register"
      BackButtonLabel="Create new account"
      showSocials={true}
    ></AuthCard>
  );
};

export default LoginForm;
