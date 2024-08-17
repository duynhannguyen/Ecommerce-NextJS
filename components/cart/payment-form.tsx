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

export default function PaymentForm({ totalPrice }: { totalPrice: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const { cart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
        console.log("done");
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
      <Button disabled={!stripe || !elements}>
        <span>Pay now</span>
      </Button>
    </form>
  );
}
