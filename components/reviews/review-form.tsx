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
  FormDescription,
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
export default function ReviewForm() {
  const params = useSearchParams();
  const form = useForm<z.infer<typeof ReviewSchema>>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });
  const ratingStars = [1, 2, 3, 4, 5];
  const onSubmit = (values: z.infer<typeof ReviewSchema>) => {
    console.log("values", values);
  };
  return (
    <>
      <Popover>
        <PopoverTrigger>
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
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leave your review</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Write your review here"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leave your rating</FormLabel>
                    <FormControl>
                      <Input
                        type="hidden"
                        placeholder="Star Rating"
                        {...field}
                      />
                      {ratingStars.map((star) => (
                        <motion.div
                          className="relative cursor-pointer "
                          key={star}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.8 }}
                        >
                          <Star
                            // key={star}
                            className={cn(
                              "text-primary bg-transparent transition-all duration-300 ease-in-out ",
                              form.getValues("rating") >= star
                                ? "text-primary"
                                : "text-muted"
                            )}
                            onClick={() => {
                              form.setValue("rating", star);
                            }}
                          />
                        </motion.div>
                      ))}
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </PopoverContent>
      </Popover>
    </>
  );
}
