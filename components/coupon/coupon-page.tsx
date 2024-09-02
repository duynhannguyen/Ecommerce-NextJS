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
import { GetExpiredCode } from "@/app/dashboard/coupon/page";

export default function CouponPage({ expiredCode }: GetExpiredCode) {
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
              <TableHead className="w-[100px]">code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Remaining</TableHead>
              <TableHead className="text-right">Orders</TableHead>
              <TableHead className="text-right">Products</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
