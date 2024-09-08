"use client";

import { useCartStore } from "@/lib/client-store";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button } from "../ui/button";
import { ChangeEvent, useState } from "react";
import { createPaymentIntent } from "@/server/actions/create-payment-intent";
import { useAction } from "next-safe-action/hooks";
import { createOrder } from "@/server/actions/create-order";
import { toast } from "sonner";
import FormError from "../auth/form-error";
import { formatPrice } from "@/lib/format-price";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function PaymentForm({ totalPrice }: { totalPrice: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, setCheckoutProgress, clearCart, discountCode } = useCartStore();
  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  console.log("discountCode", discountCode);
  console.log("cart", cart);
  const { execute, status } = useAction(createOrder, {
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
  });
  const handleApplyCoupon = () => {
    console.log("e", coupon);
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
      amount: totalPrice,
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
        execute({
          status: "pending",
          total: totalPrice,
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
      <FormError message={errorMessage} />
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
          <Button onClick={() => handleApplyCoupon()} type="button">
            Apply
          </Button>
        </div>
      </div>
      <Button
        className="  my-4 w-full "
        disabled={!stripe || !elements || loading}
      >
        {loading ? "Processing..." : `Purchase ${formatPrice(totalPrice)} `}
      </Button>
    </form>
  );
}
