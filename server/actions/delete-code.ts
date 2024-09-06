"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { db } from "..";
import { discountCode } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const deleteDiscountCode = action
  .schema(
    z.object({
      id: z.string(),
    })
  )
  .action(async ({ parsedInput: { id } }) => {
    try {
      const deletingCode = await db
        .delete(discountCode)
        .where(eq(discountCode.id, id))
        .returning();
      revalidatePath("/dashboard/coupon");
      return { success: `Coupon ${deletingCode[0].code} has been deleted ` };
    } catch (error) {
      return { error: `Failed to delete coupon ` };
    }
  });
