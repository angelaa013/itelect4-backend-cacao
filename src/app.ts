import "dotenv/config";
import cors from "cors";
import express from "express";
import { connectDatabase } from "./config/database";

const app = express();

const corsOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: corsOrigins.length > 0 ? corsOrigins : true }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Cacao backend is running" });
});

app.use("/api", async (_req, _res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, db: true });
});

export default app;
