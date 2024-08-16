"use client";

import { useCartStore } from "@/lib/client-store";
import { useState } from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function AddCart() {
  const { cart, addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const params = useSearchParams();
  const id = params.get("id");
  const productId = params.get("productId");
  const title = params.get("title");
  const price = params.get("price");
  const type = params.get("type");
  const image = params.get("image");
  if (!id || !productId || !title || !price || !type || !image) {
    toast.error("Product not found");
    return redirect("/");
  }
  return (
    <>
      <div className=" flex items-center justify-stretch gap-4 my-4 ">
        <Button
          onClick={() => {
            if (quantity > 1) setQuantity(quantity - 1);
          }}
          className="text-primary"
          variant={"secondary"}
        >
          <Minus size={18} strokeWidth={3} />
        </Button>
        <Button className="bg-primary flex-1 ">Quantity : {quantity}</Button>
        <Button
          onClick={() => {
            setQuantity(quantity + 1);
          }}
          className="text-primary"
          variant={"secondary"}
        >
          <Plus size={18} strokeWidth={3} />
        </Button>
      </div>
      <Button
        onClick={() => {
          toast.success(`Added ${title + " " + type} to your cart! `);
          addToCart({
            id: +productId,
            name: title + " " + type,
            image,
            price: +price,
            variant: {
              variantId: +id,
              quantity: quantity,
            },
          });
        }}
      >
        Add to cart
      </Button>
    </>
  );
}
