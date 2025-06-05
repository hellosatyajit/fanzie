import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "./auth/index"; // assumes auth is setup in ./lib/auth

const app = new Hono();

// --- Middleware ---
app.use(logger());

app.use(
  "/*",
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000", 
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// --- Auth Routes (Email + Google OAuth) ---
app.route("/api/auth", auth.router);

// --- Protected Route Example ---
app.get("/api/me", auth.middleware, (c) => {
  const user = c.get("user");
  return c.json({
    message: `Hello, ${user.email}`,
    user,
  });
});

// --- Base Route ---
app.get("/", (c) => {
  return c.text("OK");
});

export default app;
