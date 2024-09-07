import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from "drizzle-orm";
import * as schema from "@/server/schema";

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  "one" | "many",
  boolean,
  TSchema,
  TSchema[TableName]
>["with"];

export type InferResultType<
  TableName extends keyof TSchema,
  With extends IncludeRelation<TableName> | undefined = undefined
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: With;
  }
>;

export type ProductVariantsImagesTags = InferResultType<
  "productVariants",
  { variantsImages: true; variantsTags: true }
>;
export type ProductsWithVariants = InferResultType<
  "Product",
  { productVariants: true }
>;
export type VariantsWithProduct = InferResultType<
  "productVariants",
  { variantsImages: true; variantsTags: true; product: true }
>;
export type ReviewsWithUser = InferResultType<"reviews", { user: true }>;
export type TotalOrders = InferResultType<
  "orderProduct",
  {
    orders: {
      with: {
        user: true;
      };
    };
    product: true;
    productVariants: { with: { variantsImages: true } };
  }
>;

export type ProductWithCode = InferResultType<
  "discountCodeProduct",
  {
    codeOnProduct: true;
  }
>;
export type discountCode = InferResultType<"discountCode">;
