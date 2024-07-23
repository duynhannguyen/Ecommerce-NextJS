"use server";

import { db } from "@/server";
import { Product } from "@/server/schema";
import { eq } from "drizzle-orm";

export const getProduct = async (id: number) => {
  try {
    const product = await db.query.Product.findFirst({
      where: eq(Product.id, id),
    });

    if (!product) throw new Error("Product not found");
    return { success: product };
  } catch (error) {
    return { error: "Failed to get product" };
  }
};
