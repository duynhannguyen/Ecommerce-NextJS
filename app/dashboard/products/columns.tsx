"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useAction } from "next-safe-action/hooks";
import { deleteProduct } from "@/server/actions/delete-product";
import { toast } from "sonner";
import Link from "next/link";
import { ProductVariantsImagesTags } from "@/lib/infer-type";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProductVariant } from "./product-variants";

type ProductColumn = {
  title: string;
  price: number;
  image: string;
  variants: ProductVariantsImagesTags[];
  id: number;
};

const deleteProductWrapper = async (id: number) => {
  const product = await deleteProduct({ id });
  if (!product?.data) {
    return Error("No data found");
  }
  if (product.data.success) {
    toast.success(product.data.success);
  }
  if (product.data.error) {
    return toast.error(product.data.error);
  }
};

const ActionCell = ({ row }: { row: Row<ProductColumn> }) => {
  const { execute, status } = useAction(deleteProduct, {
    onSuccess: (data) => {
      if (data.data?.success) {
        toast.success(data.data.success);
      }
      if (data.data?.error) {
        toast.success(data.data.error);
      }
    },
    onExecute: () => {
      toast.loading("Deleting Product");
    },
  });
  const product = row.original;
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className=" dark:focus:bg-primary focus:bg-primary/50 cursor-pointer">
          <Link href={`/dashboard/add-product?id=${product.id}`}>
            Edit Product
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className=" dark:focus:bg-destructive focus:bg-destructive/50 cursor-pointer "
          onClick={() => deleteProductWrapper(product.id)}
        >
          Delete Product
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "TITLE",
  },
  {
    accessorKey: "variants",
    header: "VARIANTS",
    cell: ({ row }) => {
      const variants = row.getValue("variants") as ProductVariantsImagesTags[];
      return (
        <div className="">
          {variants.map((variant) => (
            <div key={variant.id}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ProductVariant
                      editMode={true}
                      productId={variant.productId}
                      variant={variant}
                    >
                      <div
                        className="w-5 h-5 rounded-full"
                        key={variant.id}
                        style={{ background: variant.color }}
                      ></div>
                    </ProductVariant>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{variant.productType}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <ProductVariant editMode={false} productId={row.original.id}>
                    <PlusCircle className="w-5 h-5" />
                  </ProductVariant>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a new product variant</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "PRICE",
    cell: ({ row }) => {
      const prices = parseInt(row.getValue("price"));
      const formatted = new Intl.NumberFormat("vi", {
        currency: "VND",
        style: "currency",
      }).format(prices);
      return <div className=" font-medium text-xs">{formatted}</div>;
    },
  },
  {
    accessorKey: "image",
    header: "IMAGE",
    cell: ({ row }) => {
      const cellImage = row.getValue("image") as string;
      const cellTitle = row.getValue("title") as string;

      return (
        <div className="rounded-md">
          <Image src={cellImage} alt={cellTitle} width={50} height={50} />
        </div>
      );
    },
  },
  {
    id: "actions",

    header: "ACTIONS",
    cell: ActionCell,
  },
];
