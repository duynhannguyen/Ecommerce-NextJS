import Algolia from "@/components/products/algolia";
import ProductTags from "@/components/products/product-tag";
import { Products } from "@/components/products/products";
import { db } from "@/server";
import { discountCode, discountCodeProduct } from "@/server/schema";
import { and, eq, gte, isNull, or } from "drizzle-orm";

export const revalidate = 60;

export type unExpiredCode = Awaited<ReturnType<typeof getUnExpiredCode>>;

const getUnExpiredCode = () => {
  return db
    .select()
    .from(discountCode)
    .where(
      or(
        isNull(discountCode.expiresAt),
        gte(discountCode.expiresAt, new Date()),
        and(
          isNull(discountCode.limit),
          gte(discountCode.limit, discountCode.uses)
        )
      )
    )
    .leftJoin(
      discountCodeProduct,
      eq(discountCodeProduct.discountCodeId, discountCode.id)
    );
};

export default async function Home() {
  const [unExpiredCode] = await Promise.all([getUnExpiredCode()]);
  const data = await db.query.productVariants.findMany({
    with: {
      variantsImages: true,
      variantsTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });
  return (
    <main>
      <Algolia />
      <ProductTags />
      <Products variants={data} discountCodeList={unExpiredCode} />
    </main>
  );
}
