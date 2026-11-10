import { env, reportMissingEnv } from "./src/config/env.js";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import mongoose from "mongoose";

reportMissingEnv();

// Bind the port FIRST so Render's health check passes even while the
// database is still connecting (or temporarily unreachable).
const server = app.listen(env.port, "0.0.0.0", () => {
  console.log(`[server] Listening on port ${env.port} (${env.nodeEnv})`);
});

connectDB();

const shutdown = (signal) => {
  console.log(`[server] ${signal} received, shutting down…`);
  server.close(async () => {
    await mongoose.connection.close().catch(() => {});
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (reason) => console.error("[server] Unhandled rejection:", reason));
