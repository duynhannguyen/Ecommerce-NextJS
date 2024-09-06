import AddCart from "@/components/cart/add-cart";
import Coupon from "@/components/products/coupon";
import ProductPick from "@/components/products/product-pick";
import { ProductShowCase } from "@/components/products/product-showcase";
import ProductType from "@/components/products/product-type";
import Reviews from "@/components/reviews/review";
import Stars from "@/components/reviews/stars";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format-price";
import { getReviewAvarage } from "@/lib/review-avarage";
import { db } from "@/server";
import { productVariants } from "@/server/schema";
import { eq } from "drizzle-orm";

export const revalidate = 60;

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
    const slugId = data.map((variant) => ({
      slug: variant.id.toString(),
    }));
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
          reviews: true,
          productVariants: {
            with: {
              variantsImages: true,
              variantsTags: true,
            },
          },
          productOnCode: {
            with: {
              codeOnProduct: true,
            },
          },
        },
      },
    },
  });
  console.log("variant", variant?.product.productOnCode);
  if (variant) {
    const reviewAvg = getReviewAvarage(
      variant?.product.reviews.map((rating) => rating.rating)
    );

    return (
      <main>
        <section className=" flex flex-col lg:flex-row gap-4 lg:gap-12 ">
          <div className=" flex-1">
            <ProductShowCase variants={variant.product.productVariants} />
          </div>
          <div className="flex flex-col flex-1 ">
            <h2 className="text-2xl font-bold"> {variant?.product.title} </h2>
            <div>
              <ProductType variants={variant.product.productVariants} />
              <Stars
                rating={reviewAvg}
                totalReviews={variant.product.reviews.length}
              />
            </div>
            <Separator className="my-2" />
            <p className="text-2xl font-medium py-2  ">
              {" "}
              {formatPrice(variant.product.price)}{" "}
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: variant.product.description }}
            ></div>
            <p className="text-secondary-foreground font-medium my-2 ">
              Available Colors
            </p>
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

            <Coupon couponList={variant.product.productOnCode} />

            <AddCart />
          </div>
        </section>
        <Reviews productId={variant.productId} />
      </main>
    );
  }
}
