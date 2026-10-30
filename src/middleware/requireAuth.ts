import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const requireAuth: RequestHandler = (req, res, next) => {
  const authorization = req.get("authorization");
  const match = authorization?.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    res.status(401).json({ error: "Authorization token required" });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ error: "Authentication is not configured" });
    return;
  }

  try {
    jwt.verify(match[1], secret);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default requireAuth;
