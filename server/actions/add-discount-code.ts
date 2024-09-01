"use server";

import { discountCodeSchema } from "@/types/discount-code-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { discountCode } from "../schema";

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
      } catch (error) {
        console.log(error);
      }
    }
  );
