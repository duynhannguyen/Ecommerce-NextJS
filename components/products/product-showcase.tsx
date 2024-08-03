"use client";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductVariantsImagesTags } from "@/lib/infer-type";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function ProductShowCase({
  variants,
}: {
  variants: ProductVariantsImagesTags[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [activeThumbnail, setActiveThmbnail] = useState([0]);
  const searchParams = useSearchParams();
  const selectedColor = searchParams.get("type" || variants[0].productType);
  const updatePreview = (index: number) => {
    api?.scrollTo(index);
  };
  useEffect(() => {
    if (!api) {
      return;
    }
    api.on("slidesInView", (e) => {
      setActiveThmbnail(e.slidesInView());
    });
  }, [api]);
  return (
    <Carousel setApi={setApi} opts={{ loop: true }}>
      <CarouselContent>
        {variants.map(
          (variant) =>
            variant.productType === selectedColor &&
            variant.variantsImages.map((img) => (
              <CarouselItem key={img.url}>
                {img.url ? (
                  <Image
                    priority
                    className="rounded-md w-[1280px] h-[720px] object-contain "
                    width={1280}
                    height={720}
                    alt={img.name}
                    src={img.url}
                  />
                ) : null}
              </CarouselItem>
            ))
        )}
      </CarouselContent>
      <div className="flex overflow-clip py-2 gap-4 ">
        {variants.map(
          (variant) =>
            variant.productType === selectedColor &&
            variant.variantsImages.map((img, index) => (
              <div key={img.url}>
                {img.url ? (
                  <Image
                    onClick={() => updatePreview(index)}
                    priority
                    className={cn(
                      index === activeThumbnail[0]
                        ? "opacity-100 "
                        : "opacity-75",
                      "rounded-md object-contain transition-all duration-300 ease-in-out cursor-pointer hover:opacity-75  "
                    )}
                    width={72}
                    height={48}
                    alt={img.name}
                    src={img.url}
                  />
                ) : null}
              </div>
            ))
        )}
      </div>
    </Carousel>
  );
}
