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
        onClick={() => setFilter("tâm lí")}
        className={cn(
          "cursor-pointer bg-yellow-500  hover:opacity-100 hover:bg-yellow-600 ",
          tag === "tâm lí" && tag ? "opacity-100" : "opacity-50"
        )}
      >
        Tâm lí
      </Badge>
      <Badge
        onClick={() => setFilter("sổ")}
        className={cn(
          "cursor-pointer hover:opacity-100 bg-pink-500 hover:bg-pink-600 ",
          tag === "sổ" && tag ? "opacity-100" : "opacity-50"
        )}
      >
        Sổ tay
      </Badge>
      <Badge
        onClick={() => setFilter("văn phòng phẩm")}
        className={cn(
          "cursor-pointer hover:opacity-100 bg-blue-500 hover:bg-blue-600 ",
          tag === "văn phòng phẩm" && tag ? "opacity-100" : "opacity-50"
        )}
      >
        Văn phòng phẩm
      </Badge>
    </div>
  );
}
