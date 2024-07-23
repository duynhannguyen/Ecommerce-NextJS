"use server";

import { ProductSchema } from "@/types/product-shema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { Product } from "../schema";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const createProduct = action
  .schema(ProductSchema)
  .action(async ({ parsedInput: { descriptions, id, title, price } }) => {
    const Numberprice = parseInt(price.replace(/\./g, ""), 10);

    if (isNaN(Numberprice) || Numberprice < 0) {
      return { error: "Invalid Price" };
    }

    try {
      if (id) {
        const currentProduct = await db.query.Product.findFirst({
          where: eq(Product.id, id),
        });
        if (!currentProduct) return { error: "Product not found!" };
        const updateProduct = await db
          .update(Product)
          .set({ description: descriptions, title, price: Numberprice })
          .where(eq(Product.id, id))
          .returning();
        revalidatePath("/dashboard/products");
        return {
          success: `Product ${updateProduct[0].title} has been updated `,
        };
      }
      if (!id) {
        const newProduct = await db
          .insert(Product)
          .values({
            title,
            description: descriptions,
            price: Numberprice,
          })
          .returning();
        revalidatePath("/dashboard/products");
        return {
          success: `Product ${newProduct[0].title} has been created `,
        };
      }
    } catch (error) {
      return { error: JSON.stringify(error) };
    }
  });
