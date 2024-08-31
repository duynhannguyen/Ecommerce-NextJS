"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import { addDiscountCode } from "@/server/actions/add-discount-code";
import * as z from "zod";
import { discountCodeSchema } from "@/types/discount-code-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { cn } from "@/lib/utils";
export default function DiscountCodeForm({
  products,
}: {
  products: { title: string; id: number }[];
}) {
  const [allProduct, setAllProduct] = useState(true);
  const [productId, setProductId] = useState<number[]>([]);
  const form = useForm<z.infer<typeof discountCodeSchema>>({
    resolver: zodResolver(discountCodeSchema),
    defaultValues: {
      couponCode: "",
      discountType: "percented",
      discountAmount: 0,
      products: [],
      allProduct: true,
    },
  });
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());

  const { execute, status } = useAction(addDiscountCode, {
    onSuccess: (data) => {
      console.log("data", data);
    },
  });
  const selectedProduct = (id: number) => {
    const allSelectedProduct = [...productId, id];
    const existingId = productId.includes(id);
    console.log("productId", productId);
    console.log("allSelectedProduct", allSelectedProduct);
    if (existingId) {
      const filterId = allSelectedProduct.filter(
        (productId) => productId !== id
      );
      console.log("filterId", filterId);
      setProductId(filterId);
      form.setValue("products", filterId);
      return;
    }
    setProductId(allSelectedProduct);
    form.setValue("products", allSelectedProduct);
  };
  const onSubmit = (values: z.infer<typeof discountCodeSchema>) => {
    console.log("values", values);
    execute(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Coupon</CardTitle>
        <CardDescription>
          {" "}
          Add a new coupon for your product 🎫{" "}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="couponCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coupon Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Type your code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className=" flex gap-8 ">
              <FormField
                control={form.control}
                name="discountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount type </FormLabel>
                    <FormControl>
                      <RadioGroup
                        id="discountType"
                        defaultValue="percented"
                        {...field}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="percented"
                            onClick={() =>
                              form.setValue("discountType", "percented")
                            }
                            id="percented"
                          />
                          <Label htmlFor="percented">Percented</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="fixed"
                            onClick={() =>
                              form.setValue("discountType", "fixed")
                            }
                            id="fixed"
                          />
                          <Label htmlFor="fixed">Fixed</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discountAmount"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>Discount amount</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limit</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    {" "}
                    Leave blank for infinite uses{" "}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiration</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="datetime-local"
                      min={today.toJSON().split(":").slice(0, -1).join(":")}
                      className="w-max"
                      value={undefined}
                    />
                  </FormControl>
                  <FormDescription>
                    Leave blank for no expiration
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="allProduct"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                  <FormLabel htmlFor={field.name}>All product</FormLabel>
                  <FormControl>
                    <Checkbox
                      id={field.name}
                      checked={allProduct}
                      onCheckedChange={(e) => {
                        setAllProduct(e === true);
                        form.setValue("allProduct", e === true);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="products"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div
                      className="grid grid-cols-1 gap-2 lg:grid-cols-3 md:grid-cols-2 "
                      {...field}
                    >
                      {products.map((item) => (
                        <div
                          className="flex gap-2 justify-between items-center  "
                          key={item.id}
                        >
                          <Label
                            className={cn(
                              allProduct
                                ? "text-muted-foreground cursor-not-allowed "
                                : null
                            )}
                            htmlFor={String(item.id)}
                          >
                            {" "}
                            {item.title}
                          </Label>
                          <Checkbox
                            id={String(item.id)}
                            value={item.id}
                            disabled={allProduct}
                            onCheckedChange={() => selectedProduct(item.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
