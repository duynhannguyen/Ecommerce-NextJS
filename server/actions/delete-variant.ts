"use server";

import { createSafeActionClient } from "next-safe-action";
import * as z from "zod";
import { db } from "..";
import { eq } from "drizzle-orm";
import { productVariants } from "../schema";
import { revalidatePath } from "next/cache";
import algoliasearch from "algoliasearch";
const action = createSafeActionClient();

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_ADMIN!
);

const algoliaIndex = client.initIndex("products");

export const deleteVariant = action
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const deletedVariant = await db
        .delete(productVariants)
        .where(eq(productVariants.id, id))
        .returning();

      algoliaIndex.deleteObject(deletedVariant[0].id.toString());

      revalidatePath("/dashboard/products");
      return { success: `Deleted ${deletedVariant[0].productType} ` };
    } catch (error) {
      return { error: "Failed to delete variant" };
    }
  });
