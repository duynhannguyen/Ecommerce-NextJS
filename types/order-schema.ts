import * as z from "zod";

export const CreateOrderSchema = z.object({
  total: z.number(),
  status: z.string(),
  paymentIntentId: z.string(),
  discountCodeId: z.string().optional(),
  product: z.array(
    z.object({
      productId: z.number(),
      variantId: z.number(),
      quantity: z.number(),
    })
  ),
});
