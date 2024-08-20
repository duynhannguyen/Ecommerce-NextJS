import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { TotalOrders } from "@/lib/infer-type";
import Image from "next/image";
import placeholderUser from "@/public/placeholder_user.jpg";
import { formatPrice } from "@/lib/format-price";

export default function Sales({ totalOrders }: { totalOrders: TotalOrders[] }) {
  return (
    <Card className="p-6">
      <CardTitle>New Sales</CardTitle>
      <CardDescription className="my-4">
        {" "}
        Here your recent sales{" "}
      </CardDescription>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {totalOrders.map((order) => (
              <TableRow className="font-medium" key={order.id}>
                <TableCell>
                  {order.orders.user.image && order.orders.user.name ? (
                    <div className=" flex  gap-2 items-center  ">
                      <Image
                        src={order.orders.user.image}
                        width={25}
                        height={25}
                        alt={order.orders.user.name}
                        className="rounded-full"
                      />
                      <p className="text-xs font-medium">
                        {order.orders.user.name}
                      </p>
                    </div>
                  ) : (
                    <div className=" flex gap-2 items-center ">
                      <Image
                        src={placeholderUser}
                        width={25}
                        height={25}
                        alt="user not found"
                        className="rounded-full"
                      />
                      <p className="text-xs font-medium">Unregistered user</p>
                    </div>
                  )}
                </TableCell>
                <TableCell>{order.product.title}</TableCell>
                <TableCell>{formatPrice(order.product.price)}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>
                  <div>
                    <Image
                      src={order.productVariants.variantsImages[0].url}
                      width={48}
                      height={48}
                      alt={order.product.title}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
