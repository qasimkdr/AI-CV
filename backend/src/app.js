import express from "express";
import cors from "cors";

import { env } from "./config/env.js";
import { isDbConnected } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import { errorHandler, notFound, requireDb } from "./middlewares/error.middleware.js";
import { geminiStatus } from "./services/gemini.service.js";

const app = express();

app.set("trust proxy", 1); // Render sits behind a proxy (correct req.ip for rate limiting)
app.disable("x-powered-by");

app.use(
  cors({
    origin(origin, callback) {
      // allow same-origin / server-to-server / health checks (no Origin header)
      if (!origin || env.clientUrls.includes(origin) || /^https:\/\/[a-z0-9-]+--aicvfrontend\.netlify\.app$/.test(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS: origin ${origin} is not allowed`));
    },
  })
);

app.use(express.json({ limit: "2mb" })); // room for a compressed profile photo

app.get("/", (req, res) => res.json({ name: "AI CV API", status: "ok" }));

app.get("/api/health", (req, res) => {
  const db = isDbConnected();
  res.status(db ? 200 : 503).json({
    status: db ? "ok" : "degraded",
    database: db ? "connected" : "disconnected",
    ai: geminiStatus(),
    uptime: Math.round(process.uptime()),
  });
});

app.use("/api/auth", requireDb, authRoutes);
app.use("/api/resumes", requireDb, resumeRoutes);
app.use("/api/ai", aiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
