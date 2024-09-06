"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { db } from "..";
import { discountCode } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const toggleActiveCode = action
  .schema(
    z.object({
      id: z.string(),
      status: z.boolean(),
    })
  )
  .action(async ({ parsedInput: { id, status } }) => {
    try {
      const data = await db
        .update(discountCode)
        .set({
          isActive: !status,
        })
        .where(eq(discountCode.id, id))
        .returning();
      revalidatePath("/dashboard/coupon");
      return {
        success: `Coupon ${data[0].code} has been ${
          status ? "deactive" : "active"
        } successfully `,
      };
    } catch (error) {
      return { error: `Failed to ${status ? "deactive" : "active"} coupon  ` };
    }
  });
