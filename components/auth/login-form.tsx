"use client";

import AuthCard from "./auth-card";

const LoginForm = () => {
  return (
    <AuthCard
      cardTitle="Welcome back"
      BackButtonHref="/auth/register"
      BackButtonLabel="Create new account"
      showSocials={true}
    >
      <div>
        <h1> Hey</h1>
      </div>
    </AuthCard>
  );
};

export default LoginForm;
