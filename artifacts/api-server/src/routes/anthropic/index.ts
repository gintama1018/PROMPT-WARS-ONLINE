import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, conversations as conversationsTable, messages as messagesTable } from "@workspace/db";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import {
  CreateAnthropicConversationBody,
  GetAnthropicConversationParams,
  DeleteAnthropicConversationParams,
  ListAnthropicMessagesParams,
  SendAnthropicMessageParams,
  SendAnthropicMessageBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

const SYSTEM_PROMPT = `You are the People's Election Guide — a friendly, nonpartisan civic assistant that helps Indian citizens understand the election process. You explain things in simple, plain language that anyone can understand, regardless of their education level.

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

Disclaimer reminder: For official decisions, always verify with your local Election Commission.`;

router.get("/anthropic/conversations", async (_req, res): Promise<void> => {
  const conversations = await db
    .select()
    .from(conversationsTable)
    .orderBy(conversationsTable.createdAt);
  res.json(conversations);
});

router.post("/anthropic/conversations", async (req, res): Promise<void> => {
  const parsed = CreateAnthropicConversationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [conversation] = await db
    .insert(conversationsTable)
    .values({ title: parsed.data.title })
    .returning();

  res.status(201).json(conversation);
});

router.get("/anthropic/conversations/:id", async (req, res): Promise<void> => {
  const params = GetAnthropicConversationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [conversation] = await db
    .select()
    .from(conversationsTable)
    .where(eq(conversationsTable.id, params.data.id));

  if (!conversation) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }

  const messages = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, params.data.id))
    .orderBy(messagesTable.createdAt);

  res.json({ ...conversation, messages });
});

router.delete(
  "/anthropic/conversations/:id",
  async (req, res): Promise<void> => {
    const params = DeleteAnthropicConversationParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const [deleted] = await db
      .delete(conversationsTable)
      .where(eq(conversationsTable.id, params.data.id))
      .returning();

    if (!deleted) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    res.sendStatus(204);
  }
);

router.get(
  "/anthropic/conversations/:id/messages",
  async (req, res): Promise<void> => {
    const params = ListAnthropicMessagesParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const messages = await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.conversationId, params.data.id))
      .orderBy(messagesTable.createdAt);

    res.json(messages);
  }
);

router.post(
  "/anthropic/conversations/:id/messages",
  async (req, res): Promise<void> => {
    const params = SendAnthropicMessageParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const bodyParsed = SendAnthropicMessageBody.safeParse(req.body);
    if (!bodyParsed.success) {
      res.status(400).json({ error: bodyParsed.error.message });
      return;
    }

    const [conversation] = await db
      .select()
      .from(conversationsTable)
      .where(eq(conversationsTable.id, params.data.id));

    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    await db.insert(messagesTable).values({
      conversationId: params.data.id,
      role: "user",
      content: bodyParsed.data.content,
    });

    const allMessages = await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.conversationId, params.data.id))
      .orderBy(messagesTable.createdAt);

    const chatMessages = allMessages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: chatMessages,
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        fullResponse += event.delta.text;
        res.write(`data: ${JSON.stringify({ content: event.delta.text })}\n\n`);
      }
    }

    await db.insert(messagesTable).values({
      conversationId: params.data.id,
      role: "assistant",
      content: fullResponse,
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  }
);

export default router;
