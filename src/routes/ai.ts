import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { aiRequestSchema } from "../schemas/review";
import { AiReplyError, reviewProject } from "../ai/gemini";

const router = Router();

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many AI review requests. Please wait a minute." },
});

router.post("/", aiLimiter, async (req, res) => {
  const parsed = aiRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      error: "Invalid request",
      details: parsed.error.issues,
    });
    return;
  }

  try {
    const review = await reviewProject(parsed.data.prompt);
    res.json(review);
  } catch (error) {
    console.error("AI review failed:", error);

    if (error instanceof AiReplyError) {
      res.status(502).json({ error: "Gemini returned an unusable response." });
      return;
    }

    if (
      error instanceof Error &&
      error.message.includes("GEMINI_API_KEY is missing")
    ) {
      res.status(500).json({ error: "The AI service is not configured." });
      return;
    }

    res.status(502).json({ error: "The AI service failed. Please try again." });
  }
});

export default router;