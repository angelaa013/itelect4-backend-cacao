import "dotenv/config";
import cors from "cors";
import express from "express";
import { connectDatabase } from "./config/database";
import apiRouter from "./routes/api";
import authRouter from "./routes/auth";
import aiRouter from "./routes/ai";

const app = express();

const corsOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: corsOrigins.length > 0 ? corsOrigins : true }));
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/ai", aiRouter);

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

app.use("/api", apiRouter);
app.use("/", apiRouter);

export default app;


