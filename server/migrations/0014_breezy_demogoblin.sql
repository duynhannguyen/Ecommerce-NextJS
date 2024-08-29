ALTER TABLE "discountCodeOrder" DROP CONSTRAINT "discountCodeOrder_orderId_orders_id_fk";
--> statement-breakpoint
ALTER TABLE "discountCodeOrder" DROP CONSTRAINT "discountCodeOrder_discountCodeId_discountCode_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "discountCodeOrder" ADD CONSTRAINT "discountCodeOrder_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "discountCodeOrder" ADD CONSTRAINT "discountCodeOrder_discountCodeId_discountCode_id_fk" FOREIGN KEY ("discountCodeId") REFERENCES "public"."discountCode"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
