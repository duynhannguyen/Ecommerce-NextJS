"use server";

import { VariantSchema } from "@/types/variant-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import {
  Product,
  productVariants,
  variantsImages,
  variantsTags,
} from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import algoliasearch from "algoliasearch";

const action = createSafeActionClient();

const client = algoliasearch(
  process.env.ALGOLIA_ID!,
  process.env.ALGOLIA_ADMIN!
);

const algoliaIndex = client.initIndex("products");

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

          algoliaIndex.partialUpdateObject({
            objectID: editVariant[0].id.toString(),
            id: editVariant[0].productId,
            productType: editVariant[0].productType,
            variantImages: newImg[0].url,
          });
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

          const product = await db.query.Product.findFirst({
            where: eq(Product.id, productId),
          });

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
          if (product) {
            algoliaIndex.saveObject({
              objectID: newVariant[0].id.toString(),
              id: newVariant[0].productId,
              title: product?.title,
              description: product?.description,
              price: product.price,
              productType: newVariant[0].productType,
              variantImages: newImg[0].url,
            });
          }
          revalidatePath("/dashboard/products");
          return { success: `Added ${productType}` };
        }
      } catch (error) {
        return { error: "Failed to create variant" };
      }
    }
  );
