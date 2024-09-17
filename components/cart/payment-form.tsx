"use client";

import { CartItem, useCartStore } from "@/lib/client-store";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button } from "../ui/button";
import { useState } from "react";
import { createPaymentIntent } from "@/server/actions/create-payment-intent";
import { useAction } from "next-safe-action/hooks";
import { createOrder } from "@/server/actions/create-order";
import { toast } from "sonner";
import FormError from "../auth/form-error";
import { formatPrice } from "@/lib/format-price";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { motion } from "framer-motion";
import { verifyDiscountCode } from "@/server/actions/verify-discount-code";
import { cn } from "@/lib/utils";
import FormSuccess from "../auth/form-success";

type newDiscountPrice =
  | newDiscountPriceForAllProduct
  | newDiscountPriceForAllowedProduct;
type newDiscountPriceForAllProduct = {
  amount: number;
  type: "Percented" | "Fixed";
  allProduct: true;
};
type newDiscountPriceForAllowedProduct = {
  allProduct: false;
  amount: number;
  type: "Percented" | "Fixed";
  allowedProductsInCart: CartItem[];
};

export default function PaymentForm({ totalPrice }: { totalPrice: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, setCheckoutProgress, clearCart, discountCode } = useCartStore();
  const [coupon, setCoupon] = useState("");
  const [couponId, setCouponId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [newPrice, setNewPrice] = useState(0);
  const productInCartId = cart.map((cartItem) => cartItem.id);
  // console.log("cart", cart);
  const { execute: createOrderExecute, status: createOrderStatus } = useAction(
    createOrder,
    {
      onSuccess: (data) => {
        if (data.data?.error) {
          toast.error(data.data?.error);
        }

        if (data.data?.success) {
          setLoading(false);
          setCheckoutProgress("confirmation-page");
          clearCart();
          toast.success(data.data.success);
        }
      },
    }
  );
  const { execute: verifyCodeExecute, status: verifyCodeSatus } = useAction(
    verifyDiscountCode,
    {
      onSuccess: (data) => {
        if (data.data?.success) {
          const discountCode = data.data?.success;
          console.log("discountCode", discountCode);
          if (
            discountCode.productAllowed?.length !== 0 &&
            !discountCode.allProducts
          ) {
            const allowedProductsInCart = cart.filter((cartItem) =>
              discountCode.productAllowed?.includes(cartItem.id)
            );
            const remainProductsInCart = cart.filter(
              (cartItem) => !discountCode.productAllowed?.includes(cartItem.id)
            );
            const newPriceForAllowedProduct = newDiscountPrice({
              amount: discountCode.codeDetail?.discountCode.discountAmount!,
              type: discountCode.codeDetail?.discountCode.discountType!,
              allProduct: discountCode.allProducts,
              allowedProductsInCart,
            });
            const priceForRemainProducts = remainProductsInCart.reduce(
              (acc, product) => {
                return acc + product.price * product.variant.quantity;
              },
              0
            );
            const totalPriceAfterDiscount =
              newPriceForAllowedProduct + priceForRemainProducts;
            setNewPrice(totalPriceAfterDiscount);
          }
          if (discountCode.allProducts === true) {
            const newPriceForAllProduct = newDiscountPrice({
              amount: discountCode.code?.discountAmount!,
              type: discountCode.code?.discountType!,
              allProduct: discountCode.allProducts,
            });
            setNewPrice(newPriceForAllProduct);
          }
          setSuccessMessage(`Apply coupon successfully `);
        }
        if (data.data?.error) {
          setErrorMessage(data.data.error);
        }
      },
    }
  );
  const formatType = (
    discountType: "Percented" | "Fixed",
    discountAmount: number
  ) => {
    switch (discountType) {
      case "Percented":
        return 1 - discountAmount / 100;
      case "Fixed":
        return discountAmount;
      default:
        throw new Error(
          `Invaild discount code type ${discountType satisfies never} `
        );
    }
  };

  const newDiscountPrice = (discount: newDiscountPrice) => {
    const { amount, type, allProduct } = discount;
    const newDiscountAmount = formatType(type, amount);
    if (allProduct) {
      const newDiscountPriceAllProduct = cart.reduce((acc, item) => {
        if (type === "Percented") {
          return acc + item.price * item.variant.quantity * newDiscountAmount;
        }
        return acc + item.price * item.variant.quantity;
      }, 0);
      const fixedPrice = newDiscountPriceAllProduct - amount;
      return fixedPrice;
    }
    if (!allProduct) {
      const newDiscountPriceForProduct = discount.allowedProductsInCart.reduce(
        (acc, item) => {
          if (type === "Percented") {
            return acc + item.price * item.variant.quantity * newDiscountAmount;
          }
          if (type === "Fixed") {
            return acc + item.price * item.variant.quantity - newDiscountAmount;
          }
          return acc + item.price * item.variant.quantity;
        },
        0
      );
      return newDiscountPriceForProduct;
    }
    return cart.reduce((acc, item) => {
      return acc + item.price * item.variant.quantity;
    }, 0);
  };

  const handleApplyCoupon = async () => {
    if (!coupon) {
      return;
    }
    setErrorMessage("");
    setSuccessMessage("");
    verifyCodeExecute({
      coupon,
      cart: productInCartId,
    });
    // const isCouponExpires = discountCode.find(
    //   (code) => code.discountCode.code === coupon
    // );
    // if (!isCouponExpires) {
    //   return setErrorMessage("Coupon is not available");
    // }
    // if (
    //   !(
    //     isCouponExpires.discountCode.expiresAt === null ||
    //     isCouponExpires.discountCode.expiresAt > new Date()
    //   ) ||
    //   (isCouponExpires.discountCode.uses !== null &&
    //     isCouponExpires.discountCode.limit !== null &&
    //     isCouponExpires.discountCode.limit < isCouponExpires.discountCode.uses)
    // ) {
    //   return setErrorMessage("Coupon is expired");
    // }
    // setErrorMessage("ok");
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!stripe || !elements) {
      setLoading(false);
      return;
    }
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message!);
      setLoading(false);
      return;
    }

    const data = await createPaymentIntent({
      amount: newPrice || totalPrice,
      discountCodeId: couponId,
      currency: "vnd",
    });
    if (data?.data?.error) {
      setLoading(false);
      setErrorMessage(data.data.error);
      return;
    }
    if (data?.data?.success) {
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: data?.data?.success?.clientSecret!,
        redirect: "if_required",
        confirmParams: {
          return_url: "http://localhost:3000/success",
          receipt_email: data.data.success.user as string,
        },
      });

      if (error) {
        setErrorMessage(error.message!);
        setLoading(false);
        return;
      } else {
        setLoading(false);
        createOrderExecute({
          status: "pending",
          total: newPrice || totalPrice,
          discountCodeId: couponId,
          paymentIntentId: data.data.success.paymentIntentId,
          product: cart.map((item) => ({
            productId: item.id,
            variantId: item.variant.variantId,
            quantity: item.variant.quantity,
          })),
        });
      }
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <AddressElement
        options={{
          mode: "shipping",
        }}
      />
      <div className=" space-y-2  ">
        <Label htmlFor="discountCode" className="text-sm font-normal ">
          Coupon
        </Label>
        <div className="flex gap-3 items-center ">
          <Input
            className="max-w-sm "
            id="discountCode"
            name="discountCode"
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <Button
            disabled={coupon === ""}
            onClick={() => handleApplyCoupon()}
            type="button"
          >
            Apply
          </Button>
        </div>

        <FormError message={errorMessage} />
        <FormSuccess message={successMessage} />
      </div>
      <Button
        className="  my-4 w-full "
        disabled={!stripe || !elements || loading}
      >
        {loading ? (
          "Processing..."
        ) : (
          <div className="flex items-center justify-center text-sm  ">
            Purchase
            {newPrice ? (
              <motion.div
                animate={{ scale: 1 }}
                initial={{ scale: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className=" ml-2"
              >
                {formatPrice(newPrice)}
              </motion.div>
            ) : null}
            <div
              className={cn(
                newPrice
                  ? "line-through scale-75 transition-all duration-300 ease-in-out  "
                  : "ml-1"
              )}
            >
              {formatPrice(totalPrice)}
            </div>
          </div>
        )}
      </Button>
    </form>
  );
}
