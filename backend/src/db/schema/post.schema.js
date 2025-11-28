import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { Users } from "./user.schema.js";

export const Posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  author_id: integer("authod_id")
    .references(() => Users.id)
    .notNull(),
  title: text("title", { length: 50 }),
  content: text("content").notNull(),
  image_url: varchar("image_url"),
  published: boolean("published").default(true).notNull(),
  created_At: timestamp("created_At").defaultNow().notNull(),
  updated_At: timestamp("updated_At").defaultNow().notNull(),
});
