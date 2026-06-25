import express from "express";

import { protect }
from "../middlewares/auth.middleware.js";

import {
  signup,
  login,
  logout,
  getMe,
  updateProfile,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/me", protect, getMe);

router.put(
  "/profile",
  protect,
  updateProfile
);

export default router;
