"use server";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { db } from "..";
import { discountCode, discountCodeProduct } from "../schema";
import { and, eq, gte, isNull, or } from "drizzle-orm";

const action = createSafeActionClient();

export const verifyDiscountCode = action
  .schema(
    z.object({
      coupon: z.string(),
      cart: z.array(z.number()),
    })
  )
  .action(async ({ parsedInput: { coupon, cart } }) => {
    if (cart.length === 0) {
      return { error: "Cart is empty" };
    }
    console.log("coupon", coupon);
    const exitstingDiscountCode = await db
      .select()
      .from(discountCode)
      .leftJoin(
        discountCodeProduct,
        eq(discountCodeProduct.discountCodeId, discountCode.id)
      )
      .where(
        or(
          and(
            eq(discountCode.code, coupon),
            and(
              or(
                isNull(discountCode.expiresAt),
                gte(discountCode.expiresAt, new Date())
              ),
              or(
                isNull(discountCode.limit),
                gte(discountCode.limit, discountCode.uses)
              )
            )
          ),
          and(eq(discountCode.code, coupon), eq(discountCode.allProducts, true))
        )
      );
    if (exitstingDiscountCode.length === 0) {
      return { error: "Coupon is not available or expired " };
    }
    const findProductOnCode = cart.find(
      (item) => item === exitstingDiscountCode[0].discountCodeProduct?.productId
    );
    console.log("findProductOnCode", findProductOnCode);
    if (
      !findProductOnCode &&
      exitstingDiscountCode[0].discountCode.allProducts === false
    ) {
      return { error: `Coupon can't apply for any product in cart` };
    }
    if (
      findProductOnCode &&
      exitstingDiscountCode[0].discountCode.allProducts === true
    ) {
      return { error: `Coupon can't apply for any product in cart` };
    }

    return { success: exitstingDiscountCode[0] };
  });
