import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/server";
import { orderProduct } from "@/server/schema";
import { desc } from "drizzle-orm";
import Sales from "./sales";
import Revenue from "./revenue";

export const revalidate = 0;

export default async function Analytics() {
  const totalOrders = await db.query.orderProduct.findMany({
    orderBy: [desc(orderProduct.id)],
    limit: 10,
    with: {
      orders: {
        with: { user: true },
      },
      product: true,
      productVariants: {
        with: {
          variantsImages: true,
        },
      },
    },
  });

  if (totalOrders.length === 0) {
    return (
      <Card>
        <CardTitle>No orders</CardTitle>
      </Card>
    );
  }

  if (totalOrders) {
    return (
      <Card className="p-6">
        <CardTitle> Your Analytics</CardTitle>
        <CardDescription className="my-4">
          {" "}
          Check your sales, new customers and more{" "}
        </CardDescription>
        <CardContent>
          <Sales totalOrders={totalOrders} />
          <Revenue totalOrders={totalOrders} />
        </CardContent>
      </Card>
    );
  }
}
