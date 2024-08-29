CREATE TABLE IF NOT EXISTS "discountCodeOrder" (
	"orderId" serial NOT NULL,
	"discountCodeId" text NOT NULL,
	CONSTRAINT "discountCodeOrder_orderId_discountCodeId_pk" PRIMARY KEY("orderId","discountCodeId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "discountCodeOrder" ADD CONSTRAINT "discountCodeOrder_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "discountCodeOrder" ADD CONSTRAINT "discountCodeOrder_discountCodeId_discountCode_id_fk" FOREIGN KEY ("discountCodeId") REFERENCES "public"."discountCode"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
