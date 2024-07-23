import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const RoleEnum = pgEnum("roles", ["user", "admin"]);

export const posts = pgTable("post", {
  id: serial("id").primaryKey().notNull(),
  title: text("title").notNull(),
});
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .notNull(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  password: text("password"),
  image: text("image"),
  twoFactorEnabled: boolean("twoFactorEnabled").default(false),
  role: RoleEnum("roles").default("user"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export const emailTokens = pgTable(
  "email_tokens",
  {
    id: text("identifier")
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (vt) => ({
    compositePk: primaryKey({
      columns: [vt.id, vt.token],
    }),
  })
);
export const passwordResetToken = pgTable(
  "passwordResetToken",
  {
    id: text("id")
      .$defaultFn(() => crypto.randomUUID())
      .notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (passwordReset) => ({
    compositePk: primaryKey({
      columns: [passwordReset.id, passwordReset.token],
    }),
  })
);
export const twoFactorTokens = pgTable(
  "twoFactorTokens",
  {
    id: text("id")
      .$defaultFn(() => crypto.randomUUID())
      .notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
    userID: text("UserID").references(() => users.id, { onDelete: "cascade" }),
  },
  (twoFactor) => ({
    compositePk: primaryKey({
      columns: [twoFactor.id, twoFactor.token],
    }),
  })
);

export const Product = pgTable("product", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  title: text("title").notNull(),
  created: timestamp("created").defaultNow(),
  price: real("price").notNull(),
});

export const productVariants = pgTable("productVariants", {
  id: serial("id").primaryKey(),
  color: text("color").notNull(),
  productType: text("productType").notNull(),
  updated: timestamp("updated").defaultNow(),
  productId: serial("productId")
    .notNull()
    .references(() => Product.id, { onDelete: "cascade" }),
});

export const variantsImages = pgTable("variantsImages", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  size: real("size").notNull(),
  name: text("name").notNull(),
  order: real("order").notNull(),
  variantId: serial("variantId")
    .notNull()
    .references(() => productVariants.id, {
      onDelete: "cascade",
    }),
});

export const variantsTags = pgTable("variantsTags", {
  id: serial("id").primaryKey(),
  tag: text("tag").notNull(),
  variantId: serial("variantId")
    .notNull()
    .references(() => productVariants.id, {
      onDelete: "cascade",
    }),
});

export const productRelations = relations(Product, ({ many }) => ({
  productVariants: many(productVariants, { relationName: "productVariants" }),
}));
export const productVariantsRelation = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(Product, {
      fields: [productVariants.productId],
      references: [Product.id],
      relationName: "productVariants",
    }),
    variantsImage: many(variantsImages, { relationName: "variantsImages" }),
    variantsTags: many(variantsTags, { relationName: "variantsTags" }),
  })
);

export const variantTagsRelations = relations(variantsTags, ({ one }) => ({
  productVariant: one(productVariants, {
    fields: [variantsTags.variantId],
    references: [productVariants.id],
    relationName: "variantsTags",
  }),
}));
export const variantsImagesRelations = relations(variantsImages, ({ one }) => ({
  productVariants: one(productVariants, {
    fields: [variantsImages.variantId],
    references: [productVariants.id],
    relationName: "variantsImages",
  }),
}));
