"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

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

type ProductColumn = {
  title: string;
  price: number;
  image: string;
  variants: any;
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
