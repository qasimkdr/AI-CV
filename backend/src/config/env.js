// Centralised, validated configuration. Imported first by server.js.
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const list = (value, fallback = []) =>
  value
    ? value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : fallback;

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpire: process.env.JWT_EXPIRE || "7d",
  clientUrls: list(process.env.CLIENT_URLS || process.env.CLIENT_URL, [
    "https://aicvfrontend.netlify.app",
    "http://localhost:5173",
    "http://localhost:4173",
  ]),
  geminiApiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "",
  // Optional comma-separated preference order, e.g. "gemini-3.8-flash,gemini-3.5-flash-lite"
  geminiModels: list(process.env.GEMINI_MODELS || process.env.GEMINI_MODEL),
  maxResumesPerUser: Number(process.env.MAX_RESUMES_PER_USER) || 10,
};

export function reportMissingEnv() {
  const missing = [];
  if (!env.mongoUri) missing.push("MONGO_URI");
  if (!env.jwtSecret) missing.push("JWT_SECRET");
  if (!env.geminiApiKey) missing.push("GEMINI_API_KEY");
  if (missing.length) {
    console.warn(
      `[env] Missing environment variables: ${missing.join(", ")}. ` +
        "Set them in your Render service → Environment (or a local .env file)."
    );
  }
  return missing;
}
