"use client";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductPick({
  id,
  color,
  productType,
  title,
  price,
  productId,
  image,
}: {
  id: number;
  color: string;
  productType: string;
  title: string;
  price: number;
  productId: number;
  image: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedColor = searchParams.get("type" || productType);
  return (
    <div
      className={cn("w-8 h-8 rounded-full cursor-pointer")}
      onClick={() =>
        router.push(
          `/products/${id}&price=${price}&productId=${productId}&title=${title}&type=${productType}&image=${image}&color=${color}`,
          { scroll: false }
        )
      }
    ></div>
  );
}
