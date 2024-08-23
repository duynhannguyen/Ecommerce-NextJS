"use client";
import { InstantSearchNext } from "react-instantsearch-nextjs";
import { SearchBox, Hits } from "react-instantsearch";
import { searchClient } from "@/lib/algolia-client";
import Link from "next/link";
import Image from "next/image";
import { Card } from "../ui/card";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
export default function Algolia() {
  const [active, setActive] = useState(false);

  const Mcard = useMemo(() => motion(Card), []);
  return (
    <InstantSearchNext
      indexName="products"
      searchClient={searchClient}
      future={{
        persistHierarchicalRootCount: true,
        preserveSharedStateOnUnmount: true,
      }}
    >
      <div className="relative">
        <SearchBox
          onFocus={() => {
            setActive(true);
          }}
          onBlur={() => {
            setTimeout(() => {
              setActive(false);
            }, 100);
          }}
          classNames={{
            input:
              "flex h-full w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            submitIcon: "hidden",
            resetIcon: "hidden",
            form: "relative h-10 mb-4 ",
          }}
        />

        <AnimatePresence>
          {active && (
            <Mcard
              initial={{
                scale: 0.8,
                opacity: 0,
              }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute w-full z-50 overflow-y-scroll h-96"
            >
              <Hits hitComponent={Hit} className="rounded-md" />
            </Mcard>
          )}
        </AnimatePresence>
      </div>
    </InstantSearchNext>
  );
}

function Hit({
  hit,
}: {
  hit: {
    objectID: string;
    id: string;
    price: number;
    title: string;
    productType: string;
    variantImages: string;
    _highlightResult: {
      title: {
        value: string;
        matchLevel: string;
        fullyHighlighted: boolean;
        matchedWords: string[];
      };
      productType: {
        value: string;
        matchLevel: string;
        fullyHighlighted: boolean;
        matchedWords: string[];
      };
    };
  };
}) {
  return (
    <div className="p-4 mb-2 hover:bg-secondary">
      <Link
        href={`/products/${hit.objectID}?id=${hit.objectID}&productId=${hit.id}&price=${hit.price}&title=${hit.title}&type=${hit.productType}&image=${hit.variantImages}&variantId=${hit.objectID}`}
      >
        <div className="flex w-full gap-12 items-center justify-between ">
          <Image
            src={hit.variantImages}
            alt={hit.title}
            width={60}
            height={100}
          />
          <p
            dangerouslySetInnerHTML={{
              __html: hit._highlightResult.title.value,
            }}
          ></p>
          <p
            dangerouslySetInnerHTML={{
              __html: hit._highlightResult.productType.value,
            }}
          ></p>
          <p
            className="font-medium"
            dangerouslySetInnerHTML={{ __html: hit.price }}
          ></p>
        </div>
      </Link>
    </div>
  );
}
