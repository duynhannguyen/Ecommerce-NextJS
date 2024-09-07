"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ProductWithCode } from "@/lib/infer-type";
import { Clipboard, ClipboardCheck } from "lucide-react";
import { useState } from "react";

export default function Coupon({
  couponList,
}: {
  couponList?: ProductWithCode[];
}) {
  const [isCoppy, setIsCoppy] = useState("");
  const onCoppyClipCode = (code: string) => {
    setIsCoppy(code);
    navigator.clipboard.writeText(code);
    setTimeout(() => {
      setIsCoppy("");
    }, 3000);
  };

  return (
    <div>
      <div className="my-2">
        {" "}
        {couponList?.length === 0
          ? "This product have no coupons 😓"
          : "This product have coupons 🎉"}{" "}
      </div>
      {couponList && (
        <Carousel
          opts={{
            align: "end",
          }}
          className="w-full max-w-xl "
        >
          <CarouselContent>
            {couponList.map((code) => (
              <CarouselItem
                key={code.discountCodeId}
                className=" sm:basis-1/3 md:basis-1/3 lg:basis-1/3"
              >
                <div className="p-1">
                  <Card>
                    <CardContent className="flex gap-2  items-center justify-center p-1 ">
                      <span className="text-sm font-semibold">
                        {code.codeOnProduct.code}
                      </span>
                      <span
                        className="cursor-pointer text-gray-400 hover:text-white"
                        onClick={() => onCoppyClipCode(code.codeOnProduct.code)}
                      >
                        {isCoppy === code.codeOnProduct.code ? (
                          <ClipboardCheck className="font-semibold" size={14} />
                        ) : (
                          <Clipboard className="font-semibold" size={14} />
                        )}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </div>
  );
}
