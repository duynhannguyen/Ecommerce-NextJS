import Algolia from "@/components/products/algolia";
import ProductTags from "@/components/products/product-tag";
import { Products } from "@/components/products/products";
import { db } from "@/server";

export const revalidate = 60;

export default async function Home() {
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
      <Products variants={data} />
    </main>
  );
}
