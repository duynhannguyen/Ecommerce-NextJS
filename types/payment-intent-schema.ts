import * as z from "zod";
export const PaymentIntentSchema = z.object({
  amount: z.number(),
  currency: z.string(),
  cart: z.array(
    z.object({
      quatity: z.number(),
      productId: z.number(),
      title: z.string(),
      price: z.number(),
      image: z.string(),
    })
  ),
});
