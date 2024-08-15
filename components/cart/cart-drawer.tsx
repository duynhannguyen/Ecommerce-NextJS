"use client";

import { useCartStore } from "@/lib/client-store";
import { ShoppingBag } from "lucide-react";

export default function CartDrawer() {
  const { cart } = useCartStore();

  return (
    <div>
      <ShoppingBag />
    </div>
  );
}
