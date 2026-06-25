import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import resumeRoutes
from "./routes/resume.routes.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "https://aicvfrontend.netlify.app/",
  })
);

app.use(
  "/api/resumes",
  resumeRoutes
);

app.use("/api/auth", authRoutes);

export default app;
