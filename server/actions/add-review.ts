"use server";

import { ReviewSchema } from "@/types/reviews-schema";
import { createSafeActionClient } from "next-safe-action";
import { auth } from "../auth";
import { db } from "..";
import { and, eq } from "drizzle-orm";
import { reviews } from "../schema";
import { revalidateTag } from "next/cache";

const action = createSafeActionClient();

export const addReviews = action
  .schema(ReviewSchema)
  .action(async ({ parsedInput: { comments, rating, productId } }) => {
    try {
      const session = await auth();

      if (!session) {
        return { error: "Please sign in" };
      }

      const exitstingReview = await db.query.reviews.findFirst({
        where: and(
          eq(reviews.userId, session.user.id),
          eq(reviews.productId, productId)
        ),
      });

      if (exitstingReview) {
        return { error: "You already reviewd this product" };
      }

      const newReview = await db
        .insert(reviews)
        .values({
          userId: session.user.id,
          productId,
          comments,
          rating,
        })
        .returning();

      revalidateTag(`/dashboard/${productId}`);

      return { success: newReview[0] };
    } catch (error) {
      return { error: JSON.stringify(error) };
    }
  });
