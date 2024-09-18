"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "../ui/button";
import { CouponPageProps } from "@/app/dashboard/coupon/page";
import {
  CircleCheck,
  CircleX,
  Globe,
  Infinity,
  MoreHorizontal,
  TicketX,
} from "lucide-react";
import { formatDate } from "@/lib/format-date";
import { formatDiscount } from "@/lib/format-discount-type";
import { formatNumber } from "@/lib/format-number";
import { toggleActiveCode } from "@/server/actions/toggle-active-code";
import { toast } from "sonner";
import { deleteDiscountCode } from "@/server/actions/delete-code";

export default function CouponPage({
  expiredCode,
  unExpiredCode,
}: CouponPageProps) {
  const toggleDiscountCode = async (id: string, status: boolean) => {
    const toggleCode = await toggleActiveCode({ id, status });
    if (toggleCode?.data?.success) {
      return toast.success(toggleCode.data.success);
    }
    if (toggleCode?.data?.error) {
      return toast.error(toggleCode.data.success);
    }
  };

  const HandleDeleteCode = async (id: string) => {
    const deleteCode = await deleteDiscountCode({ id });
    if (deleteCode?.data?.success) {
      return toast.success(deleteCode.data.success);
    }
    if (deleteCode?.data?.error) {
      return toast.success(deleteCode.data.error);
    }
  };

  return (
    <div className=" flex flex-col gap-5">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-between">
              <span>Coupons</span>
              <Button>
                <Link href={"/dashboard/coupon/create-coupon"}>
                  Create coupon
                </Link>
              </Button>
            </div>
          </CardTitle>
          <CardDescription>Manage your coupons here 🗃️ </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[100px]">Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="text-left">Remaining</TableHead>
                <TableHead className="text-left">Orders</TableHead>
                <TableHead className="text-left">Products</TableHead>
                <TableHead className="text-left w-[50px] ">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unExpiredCode ? (
                unExpiredCode.map((code) => (
                  <TableRow key={code.discountCodeId}>
                    <TableCell className="font-medium">
                      {code.isActive ? (
                        <CircleCheck className="text-green-500" size={16} />
                      ) : (
                        <CircleX className="text-red-500" size={16} />
                      )}
                    </TableCell>
                    <TableCell className="font-medium"> {code.code} </TableCell>
                    <TableCell>
                      {code.discountType && code.discountAmount
                        ? formatDiscount(code.discountType, code.discountAmount)
                        : null}
                    </TableCell>
                    <TableCell>
                      {code.expiresAt === null ? (
                        <Infinity />
                      ) : (
                        formatDate(code.expiresAt)
                      )}
                    </TableCell>
                    <TableCell className="text-left">
                      {code.limit === null || code.uses === null ? (
                        <Infinity />
                      ) : (
                        formatNumber(code.limit - code.uses)
                      )}
                    </TableCell>
                    <TableCell className="text-left">{code.uses}</TableCell>
                    <TableCell className="text-left">
                      {code.allProducts ? <Globe /> : code.productTitle}
                    </TableCell>
                    <TableCell className="text-left w-[50px]">
                      {" "}
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {code.isActive ? (
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() =>
                                toggleDiscountCode(
                                  code.discountCodeId,
                                  code.isActive as boolean
                                )
                              }
                            >
                              Deactive
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() =>
                                toggleDiscountCode(
                                  code.discountCodeId,
                                  code.isActive as boolean
                                )
                              }
                            >
                              Active
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem
                            className="  dark:focus:bg-destructive focus:bg-destructive/50 cursor-pointer"
                            onClick={() =>
                              HandleDeleteCode(code.discountCodeId)
                            }
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableCaption>
                  No available coupon now <TicketX />{" "}
                </TableCaption>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expires coupon</CardTitle>
          <CardDescription> Your expired coupon ❌ </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[100px]">Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="text-left">Remaining</TableHead>
                <TableHead className="text-left">Orders</TableHead>
                <TableHead className="text-left">Products</TableHead>
                <TableHead className="text-left w-[50px]">Ations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expiredCode ? (
                expiredCode.map((code) => (
                  <TableRow key={code.discountCodeId}>
                    <TableCell className="font-medium">
                      {code.isActive &&
                      code.expiresAt !== null &&
                      code.expiresAt > new Date() ? (
                        <CircleCheck className="text-green-300" size={16} />
                      ) : (
                        <CircleX className="text-red-300" size={16} />
                      )}
                    </TableCell>
                    <TableCell className="font-medium"> {code.code} </TableCell>
                    <TableCell>
                      {code.discountType && code.discountAmount
                        ? formatDiscount(code.discountType, code.discountAmount)
                        : null}
                    </TableCell>
                    <TableCell>
                      {code.expiresAt === null ? (
                        <Infinity />
                      ) : (
                        formatDate(code.expiresAt)
                      )}
                    </TableCell>
                    <TableCell className="text-left">
                      {code.limit === null || code.uses === null ? (
                        <Infinity />
                      ) : (
                        formatNumber(code.limit - code.uses)
                      )}
                    </TableCell>
                    <TableCell className="text-left">{code.uses}</TableCell>
                    <TableCell className="text-left">
                      {code.allProducts ? <Globe /> : code.productTitle}
                    </TableCell>
                    <TableCell>
                      {code.uses === 0 && (
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel
                              onClick={() =>
                                HandleDeleteCode(code.discountCodeId)
                              }
                              className="dark:focus:bg-destructive focus:bg-destructive/50 cursor-pointer"
                            >
                              Delete
                            </DropdownMenuLabel>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableCaption>
                  No available coupon now <TicketX />{" "}
                </TableCaption>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
