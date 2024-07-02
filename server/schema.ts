import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const posts = pgTable("post", {
  id: serial("id").primaryKey().notNull(),
  title: text("title").notNull(),
});
