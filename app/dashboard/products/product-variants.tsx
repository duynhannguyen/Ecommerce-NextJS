"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductVariantsImagesTags } from "@/lib/infer-type";
import { variantsImages } from "@/server/schema";
import { VariantSchema } from "@/types/variant-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
const ProductVariant = ({
  editMode,
  productId,
  variant,
  children,
}: {
  editMode: boolean;
  productId: number;
  variant?: ProductVariantsImagesTags;
  children: React.ReactNode;
}) => {
  const form = useForm<z.infer<typeof VariantSchema>>({
    resolver: zodResolver(VariantSchema),
    defaultValues: {
      tag: [],
      variantImages: [],
      color: "#000000",
      editMode,
      id: undefined,
      productId,
      productType: "Sach Lich Su",
    },
  });

  const onSubmit = () => {};

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editMode ? "Edit Mode" : "Create"} your variant{" "}
          </DialogTitle>
          <DialogDescription>
            Manage your product variants here. You can add tags, images and more
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="productType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Pick a title for your variant "
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Tags</FormLabel>
                  <FormControl>
                    <InputTags />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="variantImages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Images</FormLabel>
                  <FormControl>
                    <InputTags />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {editMode && variant && (
              <Button type="button"> Delete Variant </Button>
            )}
            <Button type="submit">
              {editMode ? "Update Variant" : "Create variant"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductVariant;
