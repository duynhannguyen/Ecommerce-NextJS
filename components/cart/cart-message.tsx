"use client";

import { useCartStore } from "@/lib/client-store";
import { motion } from "framer-motion";
import { DrawerDescription, DrawerTitle } from "../ui/drawer";
import { ArrowLeft } from "lucide-react";
export default function CartMessage() {
  const { checkoutProgress, setCheckoutProgress } = useCartStore();
  return (
    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
      <DrawerTitle className="text-center">
        {checkoutProgress === "cart-page" ? "Your cart" : null}
        {checkoutProgress === "payment-page" ? "Choose a payment method" : null}
        {checkoutProgress === "confirmation-page" ? "Order confirm" : null}
      </DrawerTitle>
      <DrawerDescription className=" text-center py-1">
        {checkoutProgress === "cart-page" ? "View and edit your bag." : null}
        {checkoutProgress === "payment-page" ? (
          <span
            onClick={() => setCheckoutProgress("cart-page")}
            className="flex justify-center items-center gap-1 hover:text-primary  "
          >
            <ArrowLeft size={14} /> Head back to cart
          </span>
        ) : null}
        {checkoutProgress === "confirmation-page" ? "Order confirm" : null}
      </DrawerDescription>
    </motion.div>
  );
}
