import mongoose from "mongoose";

import { env } from "./env.js";

mongoose.set("strictQuery", true);

// Log only the host — never the credentials in the connection string.
const safeHost = (uri) => {
  try {
    return new URL(uri.replace(/^mongodb(\+srv)?:\/\//, "http://")).host;
  } catch {
    return "(unparseable MONGO_URI)";
  }
};

const hintFor = (error) => {
  const msg = `${error?.code || ""} ${error?.message || ""}`;
  if (/ENOTFOUND|querySrv|EBADNAME/i.test(msg))
    return "The cluster hostname does not exist in DNS. Copy a fresh connection string from MongoDB Atlas (Connect → Drivers) — the cluster may have been deleted or the URI has a typo.";
  if (/bad auth|Authentication failed/i.test(msg))
    return "Wrong database username/password in MONGO_URI (URL-encode special characters in the password).";
  if (/ServerSelection|timed out|ETIMEDOUT|ECONNREFUSED/i.test(msg))
    return "Atlas is unreachable. In Atlas → Network Access, allow 0.0.0.0/0 (Render has no fixed IP) and make sure the cluster isn't paused.";
  return "";
};

let attempt = 0;

export const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * Connects with exponential backoff instead of exiting, so the HTTP server
 * stays up (Render needs an open port) and recovers once the DB is reachable.
 */
export default async function connectDB() {
  if (!env.mongoUri) {
    console.error("[db] MONGO_URI is not set — database features are disabled.");
    return;
  }

  attempt += 1;
  try {
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 10000 });
    attempt = 0;
    console.log(`[db] MongoDB connected (${safeHost(env.mongoUri)})`);
  } catch (error) {
    const delay = Math.min(60000, 2000 * 2 ** Math.min(attempt, 5));
    console.error(
      `[db] Connection to ${safeHost(env.mongoUri)} failed: ${error.code || ""} ${error.message}`
    );
    const hint = hintFor(error);
    if (hint) console.error(`[db] Hint: ${hint}`);
    console.error(`[db] Retrying in ${Math.round(delay / 1000)}s…`);
    setTimeout(connectDB, delay).unref();
  }
}

mongoose.connection.on("disconnected", () => {
  if (attempt === 0) console.warn("[db] MongoDB disconnected — the driver will try to reconnect.");
});
