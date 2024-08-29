DO $$ BEGIN
 CREATE TYPE "public"."discountType" AS ENUM('Percented', 'Fixed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "discountCode" (
	"id" text PRIMARY KEY NOT NULL,
	"discountAmount" integer,
	"discountType" "discountType",
	"code" text NOT NULL,
	"limit" integer,
	"createdAt" timestamp DEFAULT now(),
	"expires" timestamp,
	"uses" integer DEFAULT 0,
	"isActive" boolean,
	"allProducts" boolean DEFAULT true,
	CONSTRAINT "discountCode_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "discountCodeProduct" (
	"productId" serial NOT NULL,
	"discountCodeId" text NOT NULL,
	CONSTRAINT "discountCodeProduct_productId_discountCodeId_pk" PRIMARY KEY("productId","discountCodeId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "discountCodeProduct" ADD CONSTRAINT "discountCodeProduct_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "discountCodeProduct" ADD CONSTRAINT "discountCodeProduct_discountCodeId_discountCode_id_fk" FOREIGN KEY ("discountCodeId") REFERENCES "public"."discountCode"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
