"use server";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { db } from "..";
import { discountCode, discountCodeProduct } from "../schema";
import { and, eq, gt, gte, isNull, not, or } from "drizzle-orm";

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

    // const exitstingDiscountCode = await db
    //   .select()
    //   .from(discountCode)
    //   .leftJoin(
    //     discountCodeProduct,
    //     eq(discountCodeProduct.discountCodeId, discountCode.id)
    //   )
    //   .where(
    //     or(
    //       and(
    //         eq(discountCode.code, coupon),
    //         and(
    //           or(
    //             isNull(discountCode.expiresAt),
    //             gte(discountCode.expiresAt, new Date())
    //           ),
    //           or(
    //             isNull(discountCode.limit),
    //             gte(discountCode.limit, discountCode.uses)
    //           )
    //         )
    //       ),
    //       and(eq(discountCode.code, coupon), eq(discountCode.allProducts, true))
    //     )
    //   );
    const codeForAllowedProducts = await db
      .select()
      .from(discountCode)
      .leftJoin(
        discountCodeProduct,
        eq(discountCodeProduct.discountCodeId, discountCode.id)
      )
      .where(
        and(
          eq(discountCode.code, coupon),
          eq(discountCode.allProducts, false),
          and(
            or(
              isNull(discountCode.expiresAt),
              gte(discountCode.expiresAt, new Date())
            ),
            or(
              isNull(discountCode.limit),
              gt(discountCode.limit, discountCode.uses)
            )
          )
        )
      );
    const codeForAllProduct = await db
      .select()
      .from(discountCode)
      .where(
        and(
          eq(discountCode.code, coupon),
          not(eq(discountCode.allProducts, false)),
          and(
            or(
              isNull(discountCode.expiresAt),
              gte(discountCode.expiresAt, new Date())
            ),
            or(
              isNull(discountCode.limit),
              gt(discountCode.limit, discountCode.uses)
            )
          )
        )
      );
    console.log("codeForAllowedProducts", codeForAllowedProducts);
    console.log("codeForAllProduct", codeForAllProduct);
    if (codeForAllowedProducts.length !== 0 && codeForAllProduct.length === 0) {
      const selectedProducts = codeForAllowedProducts
        .filter((item) => {
          return cart.includes(item.discountCodeProduct?.productId as number);
        })
        .map((item) => item.discountCodeProduct?.productId);

      return {
        success: {
          codeDetail: codeForAllowedProducts[0],
          productAllowed: selectedProducts,
          allProducts: false,
        },
      };
    }
    if (codeForAllProduct.length !== 0 && codeForAllowedProducts.length === 0) {
      return { success: { code: codeForAllProduct[0], allProducts: true } };
    }

    return { error: "Coupon is not available or expired " };
    // console.log("exitstingDiscountCode", exitstingDiscountCode);
    // if (exitstingDiscountCode.length === 0) {
    //   return { error: "Coupon is not available or expired " };
    // }
    // const findProductOnCode = cart.find(
    //   (item) => item === exitstingDiscountCode[0].discountCodeProduct?.productId
    // );
    // console.log("findProductOnCode", findProductOnCode);
    // // const allowedProducts = exitstingDiscountCode.filter( (discountCode) => cart.includes(discountCode.discountCodeProduct?.productId)   )
    // if (
    //   !findProductOnCode &&
    //   exitstingDiscountCode[0].discountCode.allProducts === false
    // ) {
    //   return { error: `Coupon can't apply for any product in cart` };
    // }
    // if (
    //   findProductOnCode &&
    //   exitstingDiscountCode[0].discountCode.allProducts === true
    // ) {
    //   return { error: `Coupon can't apply for any product in cart` };
    // }

    // return { success: exitstingDiscountCode[0] };
  });
