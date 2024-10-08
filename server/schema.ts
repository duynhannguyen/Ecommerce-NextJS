import { relations } from "drizzle-orm";
import {
  boolean,
  index,
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
export const DiscountType = pgEnum("discountType", ["Percented", "Fixed"]);
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
  customerId: text("customerId"),
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
  reviews: many(reviews, { relationName: "reviews" }),
  productOnCode: many(discountCodeProduct, { relationName: "productOnCode" }),
}));
export const productVariantsRelation = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(Product, {
      fields: [productVariants.productId],
      references: [Product.id],
      relationName: "productVariants",
    }),
    variantsImages: many(variantsImages, { relationName: "variantsImages" }),
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

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    rating: real("rating").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: serial("productId")
      .notNull()
      .references(() => Product.id, { onDelete: "cascade" }),
    comments: text("comments").notNull(),
    created: timestamp("created").defaultNow(),
  },
  (table) => {
    return {
      productIdx: index("productIdx").on(table.productId),
      userIdx: index("userIdx").on(table.userId),
    };
  }
);

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(Product, {
    fields: [reviews.productId],
    references: [Product.id],
    relationName: "reviews",
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
    relationName: "user_reviews",
  }),
}));

export const userRelations = relations(users, ({ many }) => ({
  reviews: many(reviews, {
    relationName: "user_reviews",
  }),
  orders: many(orders, { relationName: "user_orders" }),
}));

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  total: real("total").notNull(),
  status: text("status").notNull(),
  created: timestamp("created").defaultNow(),
  receiptURL: text("receiptURL"),
  paymentIntentId: text("paymentIntentId"),
});

export const ordersRelation = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
    relationName: "user_orders",
  }),
  orderProduct: many(orderProduct, { relationName: "orderProduct" }),
  orderOnCode: many(discountCodeOrder, { relationName: "orderOnCode" }),
}));

export const orderProduct = pgTable("orderProduct", {
  id: serial("id").primaryKey(),
  quantity: integer("quantity").notNull(),
  productVariantId: serial("productVariantId")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
  productId: serial("productId")
    .notNull()
    .references(() => Product.id, { onDelete: "cascade" }),
  orderId: serial("orderId")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
});

export const orderProductRelations = relations(orderProduct, ({ one }) => ({
  orders: one(orders, {
    fields: [orderProduct.orderId],
    references: [orders.id],
    relationName: "orderProduct",
  }),
  product: one(Product, {
    fields: [orderProduct.productId],
    references: [Product.id],
    relationName: "products",
  }),
  productVariants: one(productVariants, {
    fields: [orderProduct.productVariantId],
    references: [productVariants.id],
    relationName: "productVariants",
  }),
}));

export const discountCode = pgTable("discountCode", {
  id: text("id")
    .notNull()
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  discountAmount: integer("discountAmount").notNull(),
  discountType: DiscountType("discountType").notNull(),
  code: text("code").notNull().unique(),
  limit: integer("limit"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expires"),
  uses: integer("uses").default(0),
  isActive: boolean("isActive").default(true).notNull(),
  allProducts: boolean("allProducts").default(false).notNull(),
});

export const discountCodeRlations = relations(discountCode, ({ many }) => ({
  codeOnProduct: many(discountCodeProduct, { relationName: "codeOnProduct" }),
  codeOnOrder: many(discountCodeOrder, { relationName: "codeOnOrder" }),
}));

export const discountCodeProduct = pgTable(
  "discountCodeProduct",
  {
    productId: serial("productId")
      .notNull()
      .references(() => Product.id, { onDelete: "cascade" }),
    discountCodeId: text("discountCodeId")
      .notNull()
      .references(() => discountCode.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.productId, table.discountCodeId],
    }),
  })
);
export const discountCodeProductRelation = relations(
  discountCodeProduct,
  ({ one }) => ({
    codeOnProduct: one(discountCode, {
      fields: [discountCodeProduct.discountCodeId],
      references: [discountCode.id],
      relationName: "codeOnProduct",
    }),
    productOnCode: one(Product, {
      fields: [discountCodeProduct.productId],
      references: [Product.id],
      relationName: "productOnCode",
    }),
  })
);
export const discountCodeOrder = pgTable(
  "discountCodeOrder",
  {
    orderId: serial("orderId")
      .notNull()
      .references(() => orders.id, { onDelete: "restrict" }),
    discountCodeId: text("discountCodeId")
      .notNull()
      .references(() => discountCode.id, { onDelete: "restrict" }),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.orderId, table.discountCodeId],
    }),
  })
);
export const discountCodeOrderRelation = relations(
  discountCodeOrder,
  ({ one }) => ({
    codeOnOrder: one(discountCode, {
      fields: [discountCodeOrder.discountCodeId],
      references: [discountCode.id],
      relationName: "codeOnOrder",
    }),
    productOnCode: one(orders, {
      fields: [discountCodeOrder.orderId],
      references: [orders.id],
      relationName: "orderOnCode",
    }),
  })
);
