import { useCartStore } from "@/lib/client-store";
import { motion } from "framer-motion";
import { Check, CreditCard, ShoppingCart } from "lucide-react";

export default function CartProgress() {
  const { checkoutProgress } = useCartStore();

  return (
    <div className="flex items-center justify-center pb-6 ">
      <div className="w-64 h-3 bg-muted relative rounded-md ">
        <div className="absolute w-full h-full top-0 left-0 flex items-center justify-between  ">
          <motion.span
            className="absolute bg-primary h-full ease-in-out rounded-r-md rounded-l-md  top-0 left-0 z-10  "
            initial={{ width: 0 }}
            animate={{
              width:
                checkoutProgress === "cart-page"
                  ? "0%"
                  : checkoutProgress === "payment-page"
                  ? "50%"
                  : "100%",
            }}
          />
          <motion.div
            initial={{
              scale: 0,
            }}
            animate={{
              scale: 1,
            }}
            transition={{
              delay: 0.3,
            }}
            className="bg-primary p-2 rounded-full z-20 "
          >
            <ShoppingCart className="text-white" size={14} />
          </motion.div>
          <motion.div
            initial={{
              scale: 0,
            }}
            animate={{
              scale:
                checkoutProgress === "payment-page"
                  ? 1
                  : 0 || checkoutProgress === "confirmation-page"
                  ? 1
                  : 0,
            }}
            transition={{
              delay: 0.3,
            }}
            className="bg-primary p-2 rounded-full z-20 "
          >
            <CreditCard className="text-white" size={14} />
          </motion.div>
          <motion.div
            initial={{
              scale: 0,
            }}
            animate={{
              scale: checkoutProgress === "confirmation-page" ? 1 : 0,
            }}
            transition={{
              delay: 0.3,
            }}
            className="bg-primary p-2 rounded-full z-20 "
          >
            <Check className="text-white" size={14} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
