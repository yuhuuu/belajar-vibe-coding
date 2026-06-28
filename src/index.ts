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
