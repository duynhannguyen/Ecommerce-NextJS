"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useCartStore } from "@/lib/client-store";

export default function OrderConfirmed() {
  const { setCheckoutProgress } = useCartStore();
  return (
    <div>
      <h2> Thank you for your purchase!</h2>
      <Link href={"/dashboard/orders"}>
        <Button onClick={() => setCheckoutProgress("cart-page")}>
          View your order
        </Button>{" "}
      </Link>
    </div>
  );
}
