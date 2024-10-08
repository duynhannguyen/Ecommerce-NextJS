import { db } from "@/server";
import { discountCode, orders } from "@/server/schema";
import { eq, sql } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2024-06-20",
  });
  const sig = req.headers.get("stripe-signature") || "";
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  // Read the request body as text
  const reqText = await req.text();
  // Convert the text to a buffer
  const reqBuffer = Buffer.from(reqText);

  let event;

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, sig, signingSecret);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, {
      status: 400,
    });
  }

  // Handle the event just an example!
  switch (event.type) {
    case "payment_intent.succeeded":
      const retrieveOrder = await stripe.paymentIntents.retrieve(
        event.data.object.id,
        { expand: ["latest_charge"] }
      );
      const charge = retrieveOrder.latest_charge as Stripe.Charge;
      const discountCodeId = charge.metadata.discountCodeId;
      const customer = await db
        .update(orders)
        .set({
          receiptURL: charge.receipt_url,
          status: "succeeded",
        })
        .where(eq(orders.paymentIntentId, event.data.object.id))
        .returning();
      const updateCouponUse = await db
        .update(discountCode)
        .set({
          uses: sql`${discountCode.uses} + 1`,
        })
        .where(eq(discountCode.id, discountCodeId));

      // Then define and call a function to handle the event product.created
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response("ok", { status: 200 });
}
