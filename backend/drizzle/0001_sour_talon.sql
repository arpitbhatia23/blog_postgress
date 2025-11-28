CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"content" text,
	"author_id" integer NOT NULL,
	"created_At" timestamp DEFAULT now() NOT NULL,
	"updated_At" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"authod_id" integer NOT NULL,
	"title" varchar(50),
	"content" text NOT NULL,
	"image_url" varchar,
	"published" boolean DEFAULT true NOT NULL,
	"created_At" timestamp DEFAULT now() NOT NULL,
	"updated_At" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_authod_id_users_id_fk" FOREIGN KEY ("authod_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;