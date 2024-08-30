"use server";

import { discountCodeSchema } from "@/types/discount-code-schema";
import { createSafeActionClient } from "next-safe-action";

const action = createSafeActionClient();

export const addDiscountCode = action
  .schema(discountCodeSchema)
  .action(
    async ({
      parsedInput: {
        couponCode,
        discountAmount,
        discountType,
        expiresAt,
        limit,
      },
    }) => {
      console.log("expiresAt", expiresAt);
    }
  );
