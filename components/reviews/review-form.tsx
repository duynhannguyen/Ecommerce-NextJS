"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import * as z from "zod";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { ReviewSchema } from "@/types/reviews-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { addReviews } from "@/server/actions/add-review";
import { toast } from "sonner";
export default function ReviewForm() {
  const params = useSearchParams();
  const productId = Number(params.get("productId"));

  const { execute, status } = useAction(addReviews, {
    onSuccess: (data) => {
      if (data.data?.error) {
        toast.error(data.data?.error);
      }
      if (data.data?.success) {
        toast.success("Review added 👌");
        form.reset();
      }
    },
  });
  const form = useForm<z.infer<typeof ReviewSchema>>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      rating: 0,
      comments: "",
      productId: 0,
    },
  });
  const ratingStars = [1, 2, 3, 4, 5];
  const onSubmit = (values: z.infer<typeof ReviewSchema>) => {
    execute({ rating: values.rating, comments: values.comments, productId });
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-full">
          <Button className="font-medium w-full" variant={"secondary"}>
            Leave a review
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form className=" space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave your review</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Write your review here" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormMessage />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave your rating</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <Input
                        type="hidden"
                        placeholder="Star Rating"
                        {...field}
                      />
                      {ratingStars.map((star) => {
                        return (
                          <motion.div
                            className="relative cursor-pointer "
                            key={star}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                          >
                            <Star
                              key={star}
                              className={cn(
                                "text-primary bg-transparent transition-all duration-300 ease-in-out ",
                                form.getValues("rating") >= star
                                  ? "fill-primary"
                                  : "fill-muted"
                              )}
                              onClick={() => {
                                form.setValue("rating", star, {
                                  shouldValidate: true,
                                });
                              }}
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              disabled={status === "executing"}
              type="submit"
              className="w-full "
            >
              {" "}
              {status === "executing" ? "Adding review..." : "Add your review"}
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
