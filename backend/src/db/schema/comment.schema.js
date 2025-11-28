import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { Posts } from "./post.schema.js";
import { Users } from "./user.schema.js";

export const Comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  post_id: integer("post_id")
    .references(() => Posts.id)
    .notNull(),
  content: text("content"),
  author_id: integer("author_id")
    .references(() => Users.id)
    .notNull(),
  created_At: timestamp("created_At").defaultNow().notNull(),
  updated_At: timestamp("updated_At").defaultNow().notNull(),
});
