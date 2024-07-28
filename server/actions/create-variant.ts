"use server";

import { VariantSchema } from "@/types/variant-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { productVariants, variantsImages, variantsTags } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const createVariant = action
  .schema(VariantSchema)
  .action(
    async ({
      parsedInput: {
        color,
        editMode,
        id,
        productId,
        productType,
        tag,
        variantImages: newImg,
      },
    }) => {
      try {
        if (editMode && id) {
          const editVariant = await db
            .update(productVariants)

            .set({
              color,
              productType,
              updated: new Date(),
            })
            .where(eq(productVariants.id, id))
            .returning();
          await db
            .delete(variantsTags)
            .where(eq(variantsTags.variantId, editVariant[0].id));
          await db.insert(variantsTags).values(
            tag.map((tags) => ({
              tag: tags,
              variantId: editVariant[0].id,
            }))
          );

          await db
            .delete(variantsImages)
            .where(eq(variantsImages.variantId, editVariant[0].id));
          await db.insert(variantsImages).values(
            newImg.map((img, idx) => ({
              name: img.name,
              size: img.size,
              variantId: editVariant[0].id,
              url: img.url,
              order: idx,
            }))
          );

          revalidatePath("/dashboard/products");
          return { success: `Edited ${productType}` };
        }

        if (!editMode) {
          const newVariant = await db
            .insert(productVariants)
            .values({
              color,
              productType,
              productId,
            })
            .returning();
          await db.insert(variantsTags).values(
            tag.map((tags) => ({
              tag: tags,
              variantId: newVariant[0].id,
            }))
          );
          await db.insert(variantsImages).values(
            newImg.map((img, idx) => ({
              name: img.name,
              size: img.size,
              variantId: newVariant[0].id,
              url: img.url,
              order: idx,
            }))
          );
          revalidatePath("/dashboard/products");
          return { success: `Added ${productType}` };
        }
      } catch (error) {
        return { error: "Failed to create variant" };
      }
    }
  );
