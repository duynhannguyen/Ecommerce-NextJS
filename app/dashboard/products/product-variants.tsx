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
import { VariantSchema } from "@/types/variant-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { InputTags } from "./input-tags";
import VariantsImages from "./variants-image";
import { createVariant } from "@/server/actions/create-variant";
import { toast } from "sonner";
import { forwardRef, useEffect, useState } from "react";
import { deleteVariant } from "@/server/actions/delete-variant";

type ProductVariantProps = {
  editMode: boolean;
  productId: number;
  variant?: ProductVariantsImagesTags;
  children: React.ReactNode;
};

export const ProductVariant = forwardRef<HTMLDivElement, ProductVariantProps>(
  ({ editMode, productId, variant, children }, ref) => {
    const form = useForm<z.infer<typeof VariantSchema>>({
      resolver: zodResolver(VariantSchema),
      defaultValues: {
        tag: [],
        variantImages: [],
        color: "#000000",
        editMode,
        id: undefined,
        productId,
        productType: "",
      },
    });
    const [open, setOpen] = useState(false);
    const setEdit = () => {
      if (!editMode) {
        form.reset();
        return;
      }
      if (editMode && variant) {
        form.setValue("editMode", true),
          form.setValue("id", variant.id),
          form.setValue("productId", variant.productId),
          form.setValue("color", variant.color),
          form.setValue("productType", variant.productType),
          form.setValue(
            "tag",
            variant.variantsTags.map((tag) => tag.tag)
          ),
          form.setValue(
            "variantImages",
            variant.variantsImages.map((img) => ({
              name: img.name,
              size: img.size,
              url: img.url,
            }))
          );
      }
    };
    useEffect(() => {
      setEdit();
    }, []);

    const { execute, status } = useAction(createVariant, {
      onExecute() {
        if (editMode) {
          toast.loading("Updating variant", { duration: 1 });
          setOpen(false);
        }
        if (!editMode) {
          toast.loading("Creating variant", { duration: 1 });
          setOpen(false);
        }
      },
      onSuccess(data) {
        if (data.data?.error) {
          toast.dismiss();
          toast.error(data.data.error);
        }
        if (data.data?.success) {
          toast.dismiss();
          toast.success(data.data.success);
        }
      },
    });

    const variantAction = useAction(deleteVariant, {
      onExecute() {
        toast.loading("Deleting variant", { duration: 500 });
        setOpen(false);
      },
      onSuccess(data) {
        if (data.data?.error) {
          toast.dismiss();
          toast.error(data.data.error);
        }
        if (data.data?.success) {
          toast.dismiss();
          toast.success(data.data.success);
        }
      },
    });

    const onSubmit = (values: z.infer<typeof VariantSchema>) => {
      execute(values);
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className=" lg:max-w-screen-lg overflow-y-scroll max-h-[860px] rounded-md  ">
          <DialogHeader>
            <DialogTitle>
              {editMode ? "Edit Mode" : "Create"} your variant{" "}
            </DialogTitle>
            <DialogDescription>
              Manage your product variants here. You can add tags, images and
              more
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
                      <InputTags
                        {...field}
                        onChange={(e) => field.onChange(e)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <VariantsImages />
              <div className="flex gap-4 items-center justify-center">
                {editMode && variant && (
                  <Button
                    disabled={variantAction.status === "executing"}
                    onClick={(e) => {
                      e.preventDefault();
                      variantAction.execute({ id: variant.id });
                    }}
                    variant={"destructive"}
                    type="button"
                  >
                    {" "}
                    Delete Variant{" "}
                  </Button>
                )}
                <Button
                  disabled={
                    status === "executing" ||
                    !form.formState.isValid ||
                    !form.formState.isDirty
                  }
                  className="relative"
                  type="submit"
                >
                  {editMode ? "Update Variant" : "Create variant"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
);
ProductVariant.displayName = "ProductVariant";
export default ProductVariant;
