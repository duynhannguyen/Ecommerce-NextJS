"use server";

import { CreateOrderSchema } from "@/types/order-schema";
import { createSafeActionClient } from "next-safe-action";
import { auth } from "../auth";
import { db } from "..";
import { orderProduct, orders } from "../schema";

const action = createSafeActionClient();

export const createOrder = action
  .schema(CreateOrderSchema)
  .action(
    async ({ parsedInput: { product, status, total, paymentIntentId } }) => {
      const user = await auth();

      if (!user) {
        return { error: "User not found" };
      }

      const order = await db
        .insert(orders)
        .values({
          status,
          total,
          userId: user.user.id,
          paymentIntentId,
        })
        .returning();

      const orderProducts = product.map(async (orderItem) => {
        const newOrderProduct = await db.insert(orderProduct).values({
          quantity: orderItem.quantity,
          orderId: order[0].id,
          productId: orderItem.productId,
          productVariantId: orderItem.variantId,
        });
      });
      return { success: "Order has been added" };
    }
  );
