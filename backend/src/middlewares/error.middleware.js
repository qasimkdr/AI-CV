import { isDbConnected } from "../config/db.js";

/** Fails fast with 503 instead of hanging when MongoDB is down. */
export const requireDb = (req, res, next) => {
  if (isDbConnected()) return next();
  res.status(503).json({ message: "Database is temporarily unavailable. Please try again shortly." });
};

export const notFound = (req, res) => {
  res.status(404).json({ message: `Not found: ${req.method} ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON body" });
  }
  if (err?.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body is too large" });
  }
  if (err?.name === "CastError") {
    return res.status(404).json({ message: "Resource not found" });
  }
  if (err?.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }
  if (err?.message?.startsWith("CORS")) {
    return res.status(403).json({ message: err.message });
  }

  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error("[error]", err);
  res.status(status).json({
    message: status >= 500 ? "Something went wrong on our side" : err.message,
  });
};
