"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
const Socials = () => {
  return (
    <div className="flex flex-col items-center w-full gap-4 ">
      <Button
        variant={"outline"}
        className="flex w-full gap-4"
        onClick={() =>
          signIn("google", {
            redirect: false,
            callbackUrl: "/",
          })
        }
      >
        <p>Sign in with Google</p>
        <FcGoogle className="w-5 h-5" />
      </Button>
      <Button
        variant={"outline"}
        className="flex w-full gap-4"
        onClick={() =>
          signIn("github", {
            redirect: false,
            callbackUrl: "/",
          })
        }
      >
        <p>Sign in with Github</p>
        <FaGithub className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default Socials;
