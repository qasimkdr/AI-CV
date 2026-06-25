import express from "express";

import {
  createResume,
  getMyResumes,
  getResume,
  updateResume,
  deleteResume,
} from "../controllers/resume.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  createResume
);

router.get(
  "/",
  protect,
  getMyResumes
);

router.get(
  "/:id",
  protect,
  getResume
);

router.put(
  "/:id",
  protect,
  updateResume
);

router.delete(
  "/:id",
  protect,
  deleteResume
);

export default router;