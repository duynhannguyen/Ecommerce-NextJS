ALTER TABLE "twoFactorTokens" ADD COLUMN "UserID" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "twoFactorTokens" ADD CONSTRAINT "twoFactorTokens_UserID_user_id_fk" FOREIGN KEY ("UserID") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
