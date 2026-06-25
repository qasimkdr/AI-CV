import express from "express";

import {
  enhanceResumeController,
} from "../controllers/ai.controller.js";

const router =
  express.Router();

router.post(
  "/enhance-resume",
  enhanceResumeController
);

export default router;