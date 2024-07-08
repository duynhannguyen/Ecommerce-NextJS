"use client";

import { signOut } from "next-auth/react";
import { Session } from "next-auth";

const UserButton = ({ user }: Session) => {
  return (
    <div>
      <h1>{user?.email}</h1>
      <button onClick={() => signOut()}> sign out</button>
    </div>
  );
};

export default UserButton;
