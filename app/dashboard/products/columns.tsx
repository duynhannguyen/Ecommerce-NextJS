"use client";

import { ColumnDef } from "@tanstack/react-table";
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

type ProductColumn = {
  title: string;
  price: number;
  image: string;
  variants: any;
  id: number;
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
    cell: ({ row }) => {
      const product = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className=" dark:focus:bg-primary focus:bg-primary/50 cursor-pointer">
              Edit Product
            </DropdownMenuItem>
            <DropdownMenuItem className=" dark:focus:bg-destructive focus:bg-destructive/50 cursor-pointer ">
              Delete Product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
