import "dotenv/config";
import jwt from "jsonwebtoken";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../src/config/database", () => ({
  connectDatabase: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../src/ai/gemini", () => ({
  AiReplyError: class AiReplyError extends Error {},
  reviewProject: vi.fn(),
}));

import app from "../src/app";
import { reviewProject } from "../src/ai/gemini";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in the local .env file to run this test.");
}

describe("POST /api/ai authentication and validation", () => {
  beforeEach(() => {
    vi.mocked(reviewProject).mockClear();
  });

  it("returns 401 when the request has no token", async () => {
    const response = await request(app).post("/api/ai").send({ prompt: "short" });

    expect(response.status).toBe(401);
  });

  it("returns 401 when the request has a forged token", async () => {
    const forgedToken = jwt.sign({ sub: "gt6-test" }, "not-the-local-secret");
    const response = await request(app)
      .post("/api/ai")
      .set("Authorization", `Bearer ${forgedToken}`)
      .send({ prompt: "short" });

    expect(response.status).toBe(401);
  });

  it("lets a valid token reach prompt validation without calling Gemini", async () => {
    const validToken = jwt.sign({ sub: "gt6-test" }, JWT_SECRET, { expiresIn: "1m" });
    const response = await request(app)
      .post("/api/ai")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ prompt: "too short" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid request");
    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: "Describe your project in at least 20 characters.",
        }),
      ]),
    );
    expect(reviewProject).not.toHaveBeenCalled();
  });
});
