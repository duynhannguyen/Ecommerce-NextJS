import * as z from "zod";

export const CreateOrderSchema = z.object({
  total: z.number(),
  status: z.string(),
  paymentIntentId: z.string(),
  product: z.array(
    z.object({
      productId: z.number(),
      variantId: z.number(),
      quantity: z.number(),
    })
  ),
});
