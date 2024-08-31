import { title } from "process";
import * as z from "zod";

export const discountCodeSchema = z
  .object({
    couponCode: z
      .string()
      .min(3, { message: "Coupon code must be at least 3 characters" }),
    discountType: z.enum(["percented", "fixed"]).default("percented"),
    discountAmount: z.coerce
      .number()
      .int()
      .min(1, { message: "Discount amount must greater than or equal to 1  " }),
    limit: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.number().int().min(1).optional()
    ),
    allProduct: z.coerce.boolean(),
    products: z.array(z.number()).optional(),
    expiresAt: z.preprocess(
      (value) => (value === "" ? "" : value),
      z.coerce
        .date()
        .min(new Date(), {
          message: "Expiration date must be in the future  ",
        })
        .optional()
    ),
  })
  .refine(
    (data) => data.discountAmount <= 100 || data.discountType !== "percented",
    {
      path: ["discountAmount"],
      message: "Percentage discount must be less than or equal to 100",
    }
  )
  .refine((data) => !data.allProduct || data.products?.length === 0, {
    path: ["products"],
    message: "Cannot select product when all product is selected",
  })
  .refine((data) => data.allProduct || data.products?.length !== 0, {
    path: ["products"],
    message: " Must select product when all product is not selected ",
  });
