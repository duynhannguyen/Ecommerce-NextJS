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
    const product = cart[0];
    const getDiscountCode = await db
      .select()
      .from(discountCodeProduct)
      .leftJoin(
        discountCode,
        eq(discountCodeProduct.discountCodeId, discountCode.id)
      )
      .where(
        and(
          eq(discountCodeProduct.productId, product),
          or(
            isNull(discountCode.expiresAt),
            gte(discountCode.expiresAt, new Date()),
            and(
              isNull(discountCode.limit),
              gte(discountCode.limit, discountCode.uses)
            )
          )
        )
      );
    console.log("getDiscountCode", getDiscountCode);
  });
