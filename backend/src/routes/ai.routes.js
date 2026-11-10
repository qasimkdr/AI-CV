import express from "express";

import { enhanceResumeController, suggestBulletsController } from "../controllers/ai.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { rateLimit } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

// Shared limits across all AI endpoints to protect the free Gemini quota.
const perMinute = rateLimit({ windowMs: 60 * 1000, max: 6, message: "Too many AI requests — please wait a minute." });
const perDay = rateLimit({ windowMs: 24 * 60 * 60 * 1000, max: 60, message: "Daily AI limit reached — try again tomorrow." });

router.post("/enhance-resume", protect, perMinute, perDay, enhanceResumeController);
router.post("/suggest-bullets", protect, perMinute, perDay, suggestBulletsController);

export default router;
