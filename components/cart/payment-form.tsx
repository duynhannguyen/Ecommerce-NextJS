"use client";

import { useCartStore } from "@/lib/client-store";
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

export default function PaymentForm({ totalPrice }: { totalPrice: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, setCheckoutProgress } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { execute, status } = useAction(createOrder, {
    onSuccess: (data) => {
      if (data.data?.error) {
        toast.error(data.data?.error);
      }

      if (data.data?.success) {
        setLoading(false);
        setCheckoutProgress("confirmation-page");
        toast.success(data.data.success);
      }
    },
  });
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
      <Button
        className="  my-4 w-full "
        disabled={!stripe || !elements || loading}
      >
        {loading ? "Processing..." : "Pay now"}
      </Button>
    </form>
  );
}
