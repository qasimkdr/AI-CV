import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export const protect = (req, res, next) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    req.user = jwt.verify(header.slice(7), env.jwtSecret);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
