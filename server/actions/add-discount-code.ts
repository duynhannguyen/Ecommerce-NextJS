"use server";

import { discountCodeSchema } from "@/types/discount-code-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { discountCode, discountCodeProduct } from "../schema";

const action = createSafeActionClient();

export const addDiscountCode = action
  .schema(discountCodeSchema)
  .action(
    async ({
      parsedInput: {
        couponCode,
        discountAmount,
        discountType,
        expiresAt,
        limit,
        allProduct,
        products,
      },
    }) => {
      try {
        const exitstingCode = await db.query.discountCode.findFirst({
          where: eq(discountCode.code, couponCode),
        });
        console.log("exitstingCode:", exitstingCode);
        if (exitstingCode) {
          return { error: "This code already exit" };
        }
        const saveCodeToDb = await db
          .insert(discountCode)
          .values({
            code: couponCode,
            discountAmount,
            discountType,
            limit,
            expiresAt,
            allProducts: allProduct,
          })
          .returning();

        const saveCodeToProduct = products?.map(async (productId) => {
          const saving = await db.insert(discountCodeProduct).values({
            discountCodeId: saveCodeToDb[0].id,
            productId: productId,
          });
        });
        return { success: "Create coupon successfully" };
      } catch (error) {
        console.log(error);
      }
    }
  );
