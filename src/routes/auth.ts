import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();
const DEMO_USERNAME = "student1";
const DEMO_PASSWORD = "demo123";

// The current app uses mock credentials; this signs a server-side JWT so the
// protected AI route can still verify the existing demo login flow.
router.post("/login", (req, res) => {
  const username =
    typeof req.body?.username === "string" ? req.body.username.trim() : "";
  const password =
    typeof req.body?.password === "string" ? req.body.password : "";

  if (!username || !password.trim()) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  if (username !== DEMO_USERNAME || password !== DEMO_PASSWORD) {
    res.status(401).json({ error: "Invalid demo username or password" });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ error: "Authentication is not configured" });
    return;
  }

  const token = jwt.sign({ sub: username }, secret, { expiresIn: "12h" });
  res.json({ token });
});

export default router;

