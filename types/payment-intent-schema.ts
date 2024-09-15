import * as z from "zod";
export const PaymentIntentSchema = z.object({
  amount: z.number(),
  currency: z.string(),
  discountCodeId: z.string().optional(),
});
