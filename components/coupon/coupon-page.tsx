"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { CheckCircle, Globe, Infinity, TicketX } from "lucide-react";
import { randomUUID } from "crypto";
import { formatDate } from "@/lib/format-date";
import { formatDiscount } from "@/lib/format-discount-type";
import { formatNumber } from "@/lib/format-number";

export default function CouponPage({
  expiredCode,
  unExpiredCode,
}: CouponPageProps) {
  console.log("unExpiredCode", unExpiredCode);
  return (
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {unExpiredCode ? (
              unExpiredCode.map((code) => (
                <TableRow key={code.discountCodeId}>
                  <TableCell className="font-medium">
                    <CheckCircle />
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
                  <TableCell className="text-left">$250.00</TableCell>
                  <TableCell className="text-left">
                    {code.allProducts ? <Globe /> : code.productTitle}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableCaption>
                No available coupon now <TicketX />{" "}
              </TableCaption>
            )}
          </TableBody>
          {/* <TableBody>
            <TableRow>
              <TableCell>
                <div>No available coupon now</div>
              </TableCell>
            </TableRow>
          </TableBody> */}
        </Table>
      </CardContent>
    </Card>
  );
}
