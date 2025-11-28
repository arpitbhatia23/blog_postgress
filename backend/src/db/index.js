import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;

export const db = drizzle(
  new Pool({
    connectionString: process.env.DATABASE_URL,
  })
);

export async function checkdb() {
  try {
    const result = await db.execute("SELECT 1");
    console.log("Database connected:");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}
