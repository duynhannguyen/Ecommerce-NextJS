import * as z from "zod";

export const ProductSchema = z.object({
  id: z.number().optional(),
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters long " }),
  descriptions: z.string().min(40, {
    message: "Descriptions must be as least 40 characters long ",
  }),
  price: z.string(),
});
