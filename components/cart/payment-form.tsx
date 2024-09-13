"use client";

import { useCartStore } from "@/lib/client-store";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button } from "../ui/button";
import { useRef, useState } from "react";
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

export default function PaymentForm({ totalPrice }: { totalPrice: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, setCheckoutProgress, clearCart, discountCode } = useCartStore();

  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [newPrice, setNewPrice] = useState(0);
  const productInCartId = cart.map((cartItem) => cartItem.id);
  console.log("cart", cart);
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
          const newPrice = newDiscountPrice({
            amount: discountCode.discountCode.discountAmount,
            type: discountCode.discountCode.discountType,
            productId: discountCode.discountCodeProduct?.productId,
          });
          const appliedProduct = cart.find(
            (item) => item.id === discountCode.discountCodeProduct?.productId
          );
          setNewPrice(newPrice);
          setSuccessMessage(
            `Apply coupon to product ${appliedProduct?.name} success `
          );
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

  const newDiscountPrice = ({
    amount,
    type,
    productId,
  }: {
    amount: number;
    type: "Percented" | "Fixed";
    productId?: number;
  }) => {
    const newDiscountAmount = formatType(type, amount);
    const newDiscountPrice = cart.reduce((acc, item) => {
      if (item.id === productId && type === "Percented") {
        return acc + item.price * item.variant.quantity * newDiscountAmount;
      }
      if (item.id === productId && type === "Fixed") {
        return acc + item.price * item.variant.quantity - newDiscountAmount;
      }
      return acc + item.price * item.variant.quantity;
    }, 0);
    return newDiscountPrice;
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
      currency: "vnd",
      cart: cart.map((item) => ({
        quatity: item.variant.quantity,
        price: item.price,
        productId: item.id,
        image: item.image,
        title: item.name,
      })),
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
