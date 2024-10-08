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
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
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
      discountType: "Percented",
      discountAmount: 0,
      products: [],
      allProduct: true,
    },
  });
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());

  const { execute, status } = useAction(addDiscountCode, {
    onExecute: () => {
      toast.loading("Creating coupon...", { duration: 500 });
    },
    onSuccess: ({ data }) => {
      if (data?.success) {
        form.reset();
        toast.dismiss();
        toast.success(data.success, { duration: 500 });
      }
      if (data?.error) {
        toast.dismiss();
        toast.error(data.error, { duration: 500 });
      }
    },
  });
  const selectedProduct = useCallback(
    (id: number) => {
      const allSelectedProduct = [...productId, id];
      const existingId = productId.includes(id);
      if (existingId) {
        const filterId = allSelectedProduct.filter(
          (productId) => productId !== id
        );
        setProductId(filterId);
        form.setValue("products", filterId);
        return;
      }
      setProductId(allSelectedProduct);
      form.setValue("products", allSelectedProduct);
    },
    [productId]
  );
  const onSubmit = (values: z.infer<typeof discountCodeSchema>) => {
    execute(values);
  };

  return (
    <Card>
      <CardHeader>
        <div className=" flex items-center justify-between ">
          <CardTitle>Create coupon</CardTitle>
          <Button>
            <Link href={"/dashboard/coupon"}>Coupon</Link>
          </Button>
        </div>
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
                        defaultValue="Percented"
                        {...field}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="Percented"
                            onClick={() =>
                              form.setValue("discountType", "Percented")
                            }
                            id="Percented"
                          />
                          <Label htmlFor="Percented">Percented</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="Fixed"
                            onClick={() =>
                              form.setValue("discountType", "Fixed")
                            }
                            id="Fixed"
                          />
                          <Label htmlFor="Fixed">Fixed</Label>
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
                  <FormLabel className="cursor-pointer" htmlFor={field.name}>
                    All product
                  </FormLabel>
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
                      className="grid grid-cols-1 gap-2 lg:grid-cols-3 md:grid-cols-2 mb-3 "
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
                                : null,
                              "cursor-pointer"
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
            <Button
              className="w-full transition-all duration-300 ease-in-out "
              disabled={
                status === "executing" ||
                !form.formState.isValid ||
                !form.formState.isDirty
              }
              type="submit"
            >
              Create coupon
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
