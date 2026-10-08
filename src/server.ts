import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Cacao backend is running" });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, db: true });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});