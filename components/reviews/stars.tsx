"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export default function Stars({
  rating,
  totalReviews,
  size = 14,
}: {
  rating: number;
  totalReviews?: number;
  size?: number;
}) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center ">
      {stars.map((star) => (
        <Star
          key={star}
          size={size}
          className={cn(
            "text-primary bg-transparent transition-all duration-300 ease-in-out",
            rating >= star ? "fill-primary" : "text-primary"
          )}
        ></Star>
      ))}
      <span className="text-secondary-foreground text-sm font-bold ml-2">
        {totalReviews} reviews
      </span>
    </div>
  );
}
