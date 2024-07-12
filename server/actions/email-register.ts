"use server";

import { RegisterSchema } from "@/types/register-schema";
import { createSafeActionClient } from "next-safe-action";

const action = createSafeActionClient();

export const EmailRegister = action
  .schema(RegisterSchema)
  .action(async ({ parsedInput: { email, password, name } }) => {
    console.log(email, password, name);
    return { email };
  });
