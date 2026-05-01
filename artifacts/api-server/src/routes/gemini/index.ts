import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import { eq } from "drizzle-orm";
import { db, conversations, messages } from "@workspace/db";
import { ai } from "@workspace/integrations-gemini-ai";
import { sanitizeUserContent } from "../../lib/sanitize";
import {
  CreateGeminiConversationBody,
  GetGeminiConversationParams,
  DeleteGeminiConversationParams,
  ListGeminiMessagesParams,
  SendGeminiMessageParams,
  SendGeminiMessageBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

const sendMessageRateLimiter = rateLimit({
  windowMs: 60_000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please wait a minute and try again.",
  },
});

const SYSTEM_INSTRUCTION = `You are the People's Election Guide — a friendly, nonpartisan civic assistant that helps Indian citizens understand the election process. You explain things in simple, plain language that anyone can understand, regardless of their education level.

Your core rules:
- ALWAYS remain strictly nonpartisan — never express opinions about political parties, candidates, or policies
- NEVER recommend any party, candidate, or ideology
- Explain processes, rights, and procedures only
- If asked about political parties or candidates, redirect to the official Election Commission of India website (eci.gov.in)
- Keep responses concise and practical
- For official decisions, always recommend verifying with the local Election Commission
- Reference official sources: Voter Helpline 1950, eci.gov.in, nvsp.in

You help with topics like:
- Voter registration (Form 6, 7, 8)
- Voter ID and Aadhaar
- Finding your name on the voter list
- What to do on election day
- Understanding EVMs and VVPATs
- Voter rights and the Model Code of Conduct
- NOTA (None of the Above)
- Different types of elections in India
- Filing complaints about election violations

Reminder: For official decisions, always verify with your local Election Commission.`;

router.get("/gemini/conversations", async (_req, res): Promise<void> => {
  const result = await db
    .select()
    .from(conversations)
    .orderBy(conversations.createdAt);
  res.json(result);
});

router.post("/gemini/conversations", async (req, res): Promise<void> => {
  const parsed = CreateGeminiConversationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [conversation] = await db
    .insert(conversations)
    .values({ title: parsed.data.title })
    .returning();

  res.status(201).json(conversation);
});

router.get("/gemini/conversations/:id", async (req, res): Promise<void> => {
  const params = GetGeminiConversationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [conversation] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, params.data.id));

  if (!conversation) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }

  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, params.data.id))
    .orderBy(messages.createdAt);

  res.json({ ...conversation, messages: msgs });
});

router.delete(
  "/gemini/conversations/:id",
  async (req, res): Promise<void> => {
    const params = DeleteGeminiConversationParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const [deleted] = await db
      .delete(conversations)
      .where(eq(conversations.id, params.data.id))
      .returning();

    if (!deleted) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    res.sendStatus(204);
  }
);

router.get(
  "/gemini/conversations/:id/messages",
  async (req, res): Promise<void> => {
    const params = ListGeminiMessagesParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, params.data.id))
      .orderBy(messages.createdAt);

    res.json(msgs);
  }
);

router.post(
  "/gemini/conversations/:id/messages",
  sendMessageRateLimiter,
  async (req, res): Promise<void> => {
    const params = SendGeminiMessageParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const bodyParsed = SendGeminiMessageBody.safeParse(req.body);
    if (!bodyParsed.success) {
      res.status(400).json({ error: bodyParsed.error.message });
      return;
    }

    const sanitizedContent = sanitizeUserContent(bodyParsed.data.content);
    if (!sanitizedContent) {
      res
        .status(400)
        .json({ error: "Message content cannot be empty after sanitization." });
      return;
    }

    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, params.data.id));

    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    await db.insert(messages).values({
      conversationId: params.data.id,
      role: "user",
      content: sanitizedContent,
    });

    const allMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, params.data.id))
      .orderBy(messages.createdAt);

    const chatContents = allMessages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";

    const stream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: chatContents,
      config: {
        maxOutputTokens: 8192,
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        fullResponse += text;
        res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
      }
    }

    await db.insert(messages).values({
      conversationId: params.data.id,
      role: "assistant",
      content: fullResponse,
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  }
);

export default router;
