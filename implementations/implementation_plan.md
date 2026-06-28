# Implementation Plan - Bun, ElysiaJS, Drizzle, and MySQL Project Setup

This plan outlines the steps to initialize and configure a new backend project in this directory using Bun, ElysiaJS, Drizzle ORM, and MySQL.

## Open Questions

> [!IMPORTANT]
> **MySQL Credentials**: What are the credentials for your local MySQL database (Host, Port, User, Password, DB Name) that we should use for the default configuration in the `.env` file? If not provided, we will use standard defaults:
> - Host: `localhost`
> - Port: `3306`
> - User: `root`
> - Password: `password`
> - DB Name: `belajar_vibe_coding`

## Proposed Changes

We will generate the project structure and setup the following files:

### 1. Project Initialization & Dependencies
Initialize the project structure:
- `bun init -y`
- Install dependencies: `elysia`, `drizzle-orm`, `mysql2`
- Install dev dependencies: `drizzle-kit`

### 2. Configuration Files

#### [NEW] [.env](file:///c:/Users/MyBook%20Z%20Series/Documents/Antigravity/belajar-vibe-coding/.env)
Store environment variables for the database connection:
```env
DATABASE_URL="mysql://root:password@localhost:3306/belajar_vibe_coding"
PORT=3000
```

#### [NEW] [drizzle.config.ts](file:///c:/Users/MyBook%20Z%20Series/Documents/Antigravity/belajar-vibe-coding/drizzle.config.ts)
Drizzle Kit configuration file specifying schema path and database connection:
```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "mysql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL || "mysql://root:password@localhost:3306/belajar_vibe_coding",
  },
});
```

### 3. Database Connection and Schema

#### [NEW] [schema.ts](file:///c:/Users/MyBook%20Z%20Series/Documents/Antigravity/belajar-vibe-coding/src/db/schema.ts)
A simple schema (e.g., a `users` table) to verify migration and connection:
```typescript
import { mysqlTable, serial, varchar, timestamp } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

#### [NEW] [db.ts](file:///c:/Users/MyBook%20Z%20Series/Documents/Antigravity/belajar-vibe-coding/src/db/db.ts)
Drizzle client instantiation:
```typescript
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = mysql.createPool({
  uri: process.env.DATABASE_URL || "mysql://root:password@localhost:3306/belajar_vibe_coding",
});

export const db = drizzle(connection);
```

### 4. Application Server

#### [NEW] [index.ts](file:///c:/Users/MyBook%20Z%20Series/Documents/Antigravity/belajar-vibe-coding/src/index.ts)
Setting up ElysiaJS server and routes:
```typescript
import { Elysia } from "elysia";
import { db } from "./db/db";
import { users } from "./db/schema";

const app = new Elysia()
  .get("/ping", () => ({ status: "ok", message: "pong" }))
  .get("/users", async () => {
    try {
      const allUsers = await db.select().from(users);
      return { success: true, data: allUsers };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  })
  .listen(process.env.PORT || 3000);

console.log(`Server is running at http://${app.server?.hostname}:${app.server?.port}`);
```

### 5. Package Scripts

#### [MODIFY] [package.json](file:///c:/Users/MyBook%20Z%20Series/Documents/Antigravity/belajar-vibe-coding/package.json)
Adding start and migration scripts:
```json
{
  "scripts": {
    "dev": "bun --watch src/index.ts",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate"
  }
}
```

## Verification Plan

### Automated / Command-Line Checks
- Verify `bun run dev` boots successfully.
- Verify running `bun run db:generate` compiles schemas correctly.

### Manual Verification
- Send a request to `http://localhost:3000/ping` using `curl` or browser and verify response `{ "status": "ok", "message": "pong" }`.
- Verify database connection status via the `/users` endpoint.
