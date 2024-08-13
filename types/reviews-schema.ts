import * as z from "zod";

export const ReviewSchema = z.object({
  productId: z.number(),
  rating: z
    .number()
    .min(1, { message: "Please add at least one star" })
    .max(5, { message: "Please add no more than five stars" }),
  comments: z.string(),
});
