"use server";

import DiscountCodeForm from "@/components/coupon/discount-code-form";
import { db } from "@/server";

export default async function Page() {
  const products = await db.query.Product.findMany({
    columns: {
      title: true,
      id: true,
    },
    orderBy: (product, { desc }) => [desc(product.id)],
  });
  return (
    <div>
      <DiscountCodeForm products={products} />
    </div>
  );
}
