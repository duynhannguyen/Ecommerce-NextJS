import ReviewForm from "./review-form";

export default function Reviews({ productId }: { productId: number }) {
  return (
    <section className=" space-y-8">
      <h2 className="text-2xl font-bold mb-4 ">Product Reviews</h2>
      <div>
        <ReviewForm />
      </div>
    </section>
  );
}
