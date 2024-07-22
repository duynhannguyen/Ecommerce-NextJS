"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { ProductSchema } from "@/types/product-shema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Tiptap from "./tiptap";
import { useAction } from "next-safe-action/hooks";
import { createProduct } from "@/server/actions/create-product";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";
import { formatNumber } from "./thousandFormat";
// import { ThousandFormat } from "./thousandFormat";

export default function ProductForm() {
  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: "",
      descriptions: "",
      price: "",
    },
  });
  const router = useRouter();
  const { execute, status } = useAction(createProduct, {
    onSuccess(data) {
      if (data.data?.success) {
        router.push("/dashboard/products");
        toast.success(data.data.success);
      }
      if (data.data?.error) {
        toast.error(data.data.error);
      }
    },
    onExecute() {
      toast.loading("Creating Product");
    },
  });
  const onSubmit = (value: z.infer<typeof ProductSchema>) => {
    console.log("value", value);
    execute(value);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="p-2">
                  <FormLabel>Product Title </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Product Name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descriptions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description </FormLabel>
                  <FormControl>
                    <Tiptap val={field.value} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Price </FormLabel>
                  <FormControl>
                    <div className=" flex items-center gap-2  ">
                      <span className="p-2 bg-muted rounded-md text-lg ">
                        &#8363;
                      </span>
                      <Input
                        type="text"
                        placeholder="Your price in VND"
                        step={5000}
                        {...field}
                        onBlur={(e) => {
                          const price = parseInt(
                            e.target.value.replace(/\./g, ""),
                            10
                          );

                          if (isNaN(price)) {
                            toast.error("Price must be a number");
                            form.resetField("price");
                            return;
                          }
                          if (price < 0) {
                            form.resetField("price");
                            toast.error(
                              "Price must be a positive number number"
                            );
                            return;
                          }
                          const newPrice = new Intl.NumberFormat("vi", {
                            style: "decimal",
                            currency: "VND",
                          }).format(price);

                          form.setValue("price", newPrice, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        }}
                        min={0}
                      />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={
                status === "executing" ||
                !form.formState.isValid ||
                !form.formState.isDirty
              }
              className="w-full"
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}
