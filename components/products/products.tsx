"use client";

import { VariantsWithProduct } from "@/lib/infer-type";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { formatPrice } from "@/lib/format-price";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

type ProductType = {
  variants: VariantsWithProduct[];
};
export const Products = ({ variants }: ProductType) => {
  const params = useSearchParams();
  const paramTag = params.get("tag");

  const filterByTag = useMemo(() => {
    if (paramTag && variants) {
      return variants.filter((variant) =>
        variant.variantsTags.some((tag) => tag.tag === paramTag)
      );
    }
    return variants;
  }, [paramTag]);

  return (
    <main className=" grid sm:grid-cols-1 md:grid-cols-2 gap-12 lg:grid-cols-3  ">
      {filterByTag.map((variant) => (
        <Link
          className="py-2 w-full h-[600px] flex flex-col gap-3 "
          key={variant.id}
          href={`/products/${variant.id}?id=${variant.id}&productId=${variant.productId}&price=${variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${variant.variantsImages[0].url}`}
        >
          <Image
            className=" rounded-md w-full h-4/5 overflow-y-hidden  "
            src={variant.variantsImages[0].url}
            width={350}
            height={350}
            alt={variant.product.title}
            loading="lazy"
          />

          <div className=" h-1/5 flex  justify-between">
            <div className=" font-medium">
              <h2> {variant.product.title} </h2>
              <p className=" text-sm text-muted-foreground">
                {variant.productType}
              </p>
            </div>
            <div>
              <Badge className="text-sm  " variant={"secondary"}>
                {formatPrice(variant.product.price)}
              </Badge>
            </div>
          </div>
        </Link>
      ))}
    </main>
  );
};
