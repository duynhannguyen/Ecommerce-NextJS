"use server";

import CouponPage from "@/components/coupon/coupon-page";
import { db } from "@/server";
import { discountCode, discountCodeProduct } from "@/server/schema";
import { and, asc, eq, gte, isNotNull, isNull, lte, or } from "drizzle-orm";

const getExpiredCode = async () => {
  return await db
    .select()
    .from(discountCode)
    .innerJoin(
      discountCodeProduct,
      eq(discountCodeProduct.discountCodeId, discountCode.id)
    )
    .where(
      or(
        and(
          lte(discountCode.expiresAt, new Date()),
          isNotNull(discountCode.expiresAt)
        ),
        and(
          isNotNull(discountCode.limit),
          lte(discountCode.limit, discountCode.uses)
        )
      )
    )
    .orderBy(asc(discountCode.expiresAt));
};

const getUnExpiredCode = async () => {
  return await db
    .select()
    .from(discountCode)
    .innerJoin(
      discountCodeProduct,
      eq(discountCodeProduct.discountCodeId, discountCode.id)
    )
    .where(
      or(
        and(
          gte(discountCode.expiresAt, new Date()),
          isNull(discountCode.expiresAt)
        ),
        and(
          isNull(discountCode.limit),
          gte(discountCode.limit, discountCode.uses)
        )
      )
    );
};

export type GetExpiredCode = {
  expiredCode: Awaited<ReturnType<typeof getExpiredCode>>;
};
export type GetUnExpiredCode = {
  unExpiredCode: Awaited<ReturnType<typeof getUnExpiredCode>>;
};

export default async function Page() {
  return <CouponPage expiredCode={getExpiredCode} />;
}
