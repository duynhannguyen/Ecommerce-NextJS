"use server";

import CouponPage from "@/components/coupon/coupon-page";
import { db } from "@/server";
import { discountCode, discountCodeProduct, Product } from "@/server/schema";
import {
  and,
  asc,
  desc,
  eq,
  gt,
  gte,
  isNotNull,
  isNull,
  lte,
  or,
  sql,
} from "drizzle-orm";

const getExpiredCode = () => {
  return db
    .select({
      discountCodeId: discountCode.id,
      code: discountCode.code,
      discountAmount: discountCode.discountAmount,
      discountType: discountCode.discountType,
      limit: discountCode.limit,
      createdAt: discountCode.createdAt,
      expiresAt: discountCode.expiresAt,
      uses: discountCode.uses,
      isActive: discountCode.isActive,
      allProducts: discountCode.allProducts,
      productTitle: sql<string>`string_agg(${Product.title}, ', ')`.as(
        "productTitle"
      ),
    })
    .from(discountCode)
    .leftJoin(
      discountCodeProduct,
      eq(discountCodeProduct.discountCodeId, discountCode.id)
    )
    .leftJoin(Product, eq(discountCodeProduct.productId, Product.id))
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
    .groupBy(
      discountCode.code,
      discountCode.discountAmount,
      discountCode.discountType,
      discountCode.limit,
      discountCode.createdAt,
      discountCode.expiresAt,
      discountCode.uses,
      discountCode.isActive,
      discountCode.allProducts,
      discountCode.id
    )
    .orderBy(desc(discountCode.expiresAt));
};

const getUnExpiredCode = () => {
  return db
    .select({
      code: discountCode.code,
      discountCodeId: discountCode.id,
      discountAmount: discountCode.discountAmount,
      discountType: discountCode.discountType,
      limit: discountCode.limit,
      createdAt: discountCode.createdAt,
      expiresAt: discountCode.expiresAt,
      uses: discountCode.uses,
      isActive: discountCode.isActive,
      allProducts: discountCode.allProducts,
      productTitle: sql<string>`string_agg(${Product.title}, ', ')`.as(
        "productTitle"
      ),
    })
    .from(discountCode)
    .leftJoin(
      discountCodeProduct,
      eq(discountCodeProduct.discountCodeId, discountCode.id)
    )
    .leftJoin(Product, eq(discountCodeProduct.productId, Product.id))

    .where(
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
    .orderBy(desc(discountCode.expiresAt))
    .groupBy(
      discountCode.code,
      discountCode.discountAmount,
      discountCode.discountType,
      discountCode.limit,
      discountCode.createdAt,
      discountCode.expiresAt,
      discountCode.uses,
      discountCode.isActive,
      discountCode.id,
      discountCode.allProducts
    );
};
export type CouponPageProps = {
  expiredCode: Awaited<ReturnType<typeof getExpiredCode>>;
  unExpiredCode: Awaited<ReturnType<typeof getUnExpiredCode>>;
};

export default async function Page() {
  const [expiredCode, unExpiredCode] = await Promise.all([
    getExpiredCode(),
    getUnExpiredCode(),
  ]);

  return <CouponPage expiredCode={expiredCode} unExpiredCode={unExpiredCode} />;
}
