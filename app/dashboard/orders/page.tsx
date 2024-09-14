import { db } from "@/server";
import { auth } from "@/server/auth";
import { orders } from "@/server/schema";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistance, subMinutes } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/format-price";
import Link from "next/link";

export default async function Page() {
  const user = await auth();

  if (!user) {
    redirect("/login");
  }

  const userOrders = await db.query.orders.findMany({
    where: eq(orders.userId, user.user.id),
    with: {
      orderProduct: {
        with: {
          orders: true,
          product: true,
          productVariants: {
            with: { variantsImages: true },
          },
        },
      },
      orderOnCode: {
        with: {
          codeOnOrder: true,
        },
      },
    },
    orderBy: [desc(orders.created)],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Order</CardTitle>
        <CardDescription>Check status of your order</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of your recent orders.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Coupon</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{formatPrice(order.total)} </TableCell>
                <TableCell>
                  <Badge
                    className={
                      order.status === "succeeded"
                        ? "bg-green-700 hover:bg-green-800 "
                        : "bg-yellow-700 hover:bg-yellow-800 "
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDistance(subMinutes(order.created!, 0), new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>
                  {order.orderOnCode.length === 0
                    ? "No coupon applied"
                    : order.orderOnCode[0].codeOnOrder.code}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"}>
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="rounded-md">
                        <DropdownMenuItem>
                          <DialogTrigger asChild>
                            <Button variant={"ghost"} className="w-full">
                              View detail
                            </Button>
                          </DialogTrigger>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {order.receiptURL ? (
                            <Button
                              asChild
                              variant={"ghost"}
                              className="w-full"
                            >
                              <Link href={order.receiptURL} target="_blank">
                                Download Reciept
                              </Link>
                            </Button>
                          ) : null}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-center">
                          Order Details #{order.id}
                        </DialogTitle>
                      </DialogHeader>
                      <DialogDescription className="text-center">
                        Your order total is {formatPrice(order.total)}
                      </DialogDescription>
                      <Card className="flex flex-col gap-4  p-2 overflow-auto ">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Image</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Product</TableHead>
                              <TableHead>Color</TableHead>
                              <TableHead>Quantity</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {order.orderProduct.map((product) => (
                              <TableRow key={product.id}>
                                <TableCell>
                                  <Image
                                    src={
                                      product.productVariants.variantsImages[0]
                                        .url
                                    }
                                    width={48}
                                    height={48}
                                    alt={product.product.title}
                                  />
                                </TableCell>
                                <TableCell>
                                  {formatPrice(product.product.price)}
                                </TableCell>
                                <TableCell>{product.product.title}</TableCell>
                                <TableCell>
                                  <div
                                    style={{
                                      background: product.productVariants.color,
                                    }}
                                    className="h-4 w-4 rounded-full "
                                  ></div>
                                </TableCell>
                                <TableCell className="font-semibold">
                                  {product.quantity}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Card>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
