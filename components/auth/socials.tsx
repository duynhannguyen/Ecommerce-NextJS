"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";

const Socials = () => {
  return (
    <div>
      <Button
        onClick={() =>
          signIn("google", {
            redirect: false,
            callbackUrl: "/",
          })
        }
      >
        Sign in with Google
      </Button>
      <Button
        onClick={() =>
          signIn("github", {
            redirect: false,
            callbackUrl: "/",
          })
        }
      >
        Sign in with Github
      </Button>
    </div>
  );
};

export default Socials;
