"use client";

import { useCartStore } from "@/lib/client-store";
import { ShoppingBag } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { AnimatePresence, motion } from "framer-motion";
import CartItems from "./cart-items";

export default function CartDrawer() {
  const { cart } = useCartStore();

  return (
    <Drawer>
      <DrawerTrigger>
        <div className=" relative px-2">
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0 }}
                className="absolute flex items-center justify-center -top-1 -right-0.5 w-4 h-4 dark:bg-primary bg-primary text-xs font-bold rounded-full "
              >
                {cart.length}
              </motion.span>
            )}
          </AnimatePresence>
          <ShoppingBag />
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>Cart Stuff</DrawerHeader>
        <CartItems />
      </DrawerContent>
    </Drawer>
  );
}