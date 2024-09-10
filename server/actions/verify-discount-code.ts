import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

const action = createSafeActionClient();

export const verifyDiscountCode = action
  .schema(
    z.object({
      coupon: z.string(),
      cart: z.array(z.number()),
    })
  )
  .action(async ({ parsedInput: { coupon, cart } }) => {
    console.log("coupon", coupon);
  });
