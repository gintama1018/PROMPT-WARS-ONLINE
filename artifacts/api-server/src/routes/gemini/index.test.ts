import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("Gemini route validation", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/testdb";
    process.env.AI_INTEGRATIONS_GEMINI_BASE_URL = "https://example.com";
    process.env.AI_INTEGRATIONS_GEMINI_API_KEY = "test-key";
  });

  it("returns 400 for invalid create conversation payload", async () => {
    const { default: geminiRouter } = await import("./index");
    const app = express();

    app.use(express.json());
    app.use(geminiRouter);

    const res = await request(app).post("/gemini/conversations").send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
