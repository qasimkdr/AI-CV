import express from "express";

import { enhanceResumeController } from "../controllers/ai.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { rateLimit } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.post(
  "/enhance-resume",
  protect,
  rateLimit({ windowMs: 60 * 1000, max: 4, message: "Too many AI requests — please wait a minute." }),
  rateLimit({ windowMs: 24 * 60 * 60 * 1000, max: 40, message: "Daily AI limit reached — try again tomorrow." }),
  enhanceResumeController
);

export default router;
