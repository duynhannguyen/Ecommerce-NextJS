import ProductPick from "@/components/products/product-pick";
import ProductType from "@/components/products/product-type";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format-price";
import { db } from "@/server";
import { productVariants } from "@/server/schema";
import { eq } from "drizzle-orm";

export async function generateStaticParams() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantsImages: true,
      variantsTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });

  if (data) {
    const slugId = data.map((variant) => {
      slug: variant.id.toString();
    });
    return slugId;
  }

  return [];
}

export default async function Page({ params }: { params: { slug: string } }) {
  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, Number(params.slug)),
    with: {
      product: {
        with: {
          productVariants: {
            with: {
              variantsImages: true,
              variantsTags: true,
            },
          },
        },
      },
    },
  });
  if (variant) {
    return (
      <main>
        <section>
          <div>
            <h1>Images</h1>
          </div>
          <div className="flex gap-2 flex-col flex-1 ">
            <h2 className=""> {variant?.product.title} </h2>
            <div>
              <ProductType variants={variant.product.productVariants} />
            </div>
            <Separator />
            <p className="text-2xl font-medium ">
              {" "}
              {formatPrice(variant.product.price)}{" "}
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: variant.product.description }}
            ></div>
            <p className="text-secondary-foreground">Available Colors</p>
            <div className="flex gap-4">
              {variant.product.productVariants.map((productVariant) => (
                <ProductPick
                  key={productVariant.id}
                  id={productVariant.id}
                  productId={productVariant.productId}
                  productType={productVariant.productType}
                  color={productVariant.color}
                  image={productVariant.variantsImages[0]?.url}
                  price={variant.product.price}
                  title={variant.product.title}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }
}
