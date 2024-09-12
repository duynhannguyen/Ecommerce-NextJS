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
    const product = cart[0];
    // const getDiscountCode = cart.map(async (cartItem) => {
    //   let couponList: any = [];
    //   const verifyDiscountCode = await db
    //     .select()
    //     .from(discountCode)
    //     .leftJoin(
    //       discountCodeProduct,
    //       eq(discountCodeProduct.discountCodeId, discountCode.id)
    //     )
    //     .where(
    //       or(
    //         and(
    //           eq(discountCodeProduct.productId, cartItem),
    //           eq(discountCode.code, coupon),
    //           and(
    //             or(
    //               isNull(discountCode.expiresAt),
    //               gte(discountCode.expiresAt, new Date())
    //             ),
    //             or(
    //               isNull(discountCode.limit),
    //               gte(discountCode.limit, discountCode.uses)
    //             )
    //           )
    //         ),
    //         and(
    //           eq(discountCode.code, coupon),
    //           eq(discountCode.allProducts, true)
    //         )
    //       )
    //     );
    //   const flatVerifyDiscountCode = verifyDiscountCode.flat(1);
    //   console.log("flatVerifyDiscountCode", flatVerifyDiscountCode);
    //   return { cartItem: flatVerifyDiscountCode };
    // });
    // Promise.all(getDiscountCode).then((results) => {
    //   console.log("results", results);
    // });
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
            // eq(discountCodeProduct.productId, ),
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
    if (!findProductOnCode) {
      return { error: `Coupon can't apply for ant product in cart` };
    }
    return { success: exitstingDiscountCode[0] };
  });
