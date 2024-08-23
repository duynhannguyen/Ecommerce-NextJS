"use client";

import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductTags() {
  const router = useRouter();
  const params = useSearchParams();
  const tag = params.get("tag");
  const setFilter = (tag: string) => {
    if (tag) {
      router.push(`?tag=${tag}`);
    }
    if (!tag) {
      router.push("/");
    }
  };

  return (
    <div className="my-4 flex items-center justify-center gap-4 ">
      <Badge
        onClick={() => setFilter("")}
        className={cn(
          "cursor-pointer hover:opacity-100 bg-black hover:bg-black/75 ",
          !tag ? "opacity-100" : "opacity-50"
        )}
      >
        All
      </Badge>
      <Badge
        onClick={() => setFilter("yellow")}
        className={cn(
          "cursor-pointer bg-yellow-500  hover:opacity-100 hover:bg-yellow-600 ",
          tag === "yellow" && tag ? "opacity-100" : "opacity-50"
        )}
      >
        Yellow
      </Badge>
      <Badge
        onClick={() => setFilter("pink")}
        className={cn(
          "cursor-pointer hover:opacity-100 bg-pink-500 hover:bg-pink-600 ",
          tag === "pink" && tag ? "opacity-100" : "opacity-50"
        )}
      >
        Pink
      </Badge>
    </div>
  );
}
