import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = mysql.createPool({
  uri: process.env.DATABASE_URL || "mysql://root:password@localhost:3306/belajar_vibe_coding",
});

export const db = drizzle(connection);
