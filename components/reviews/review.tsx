import { db } from "@/server";
import ReviewForm from "./review-form";
import Review from "./reviews";
import { desc, eq } from "drizzle-orm";
import { reviews } from "@/server/schema";
import ReviewChart from "./review-chart";

export default async function Reviews({ productId }: { productId: number }) {
  const data = await db.query.reviews.findMany({
    with: { user: true },
    where: eq(reviews.productId, productId),
    orderBy: [desc(reviews.created)],
  });
  return (
    <section className=" space-y-8">
      <h2 className="text-2xl font-bold mb-4 ">Product Reviews</h2>
      <div className="flex gap-2 lg:gap-12 justify-stretch lg:flex-row flex-col ">
        <div className="flex-1 ">
          {" "}
          <Review reviews={data} />
        </div>

        <div className="flex-1 flex flex-col gap-2 ">
          {" "}
          <ReviewForm />
          <ReviewChart reviews={data} />
        </div>
      </div>
    </section>
  );
}
