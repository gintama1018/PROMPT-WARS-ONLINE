import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Loader2, Sparkles, Plus, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import {
  useListGeminiConversations,
  useCreateGeminiConversation,
  useGetGeminiConversation,
  useDeleteGeminiConversation,
  getListGeminiConversationsQueryKey,
  getGetGeminiConversationQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

const QUICK_REPLIES = [
  "How do I register to vote?",
  "What if my name isn't on the voter list?",
  "Can I vote if I moved cities?",
  "What is Form 6?",
];

export default function AskTheGuide() {
  const queryClient = useQueryClient();
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);

  const { data: conversations, isLoading: loadingConversations } = useListGeminiConversations();
  const createConversation = useCreateGeminiConversation();
  const deleteConversation = useDeleteGeminiConversation();

  const handleCreateNew = () => {
    createConversation.mutate(
      { data: { title: "New Conversation" } },
      {
        onSuccess: (newConv) => {
          queryClient.invalidateQueries({ queryKey: getListGeminiConversationsQueryKey() });
          setActiveConversationId(newConv.id);
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteConversation.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListGeminiConversationsQueryKey() });
          if (activeConversationId === id) setActiveConversationId(null);
        },
      }
    );
  };

  const handleQuickReply = (reply: string) => {
    createConversation.mutate(
      { data: { title: reply.substring(0, 40) } },
      {
        onSuccess: (newConv) => {
          queryClient.invalidateQueries({ queryKey: getListGeminiConversationsQueryKey() });
          setActiveConversationId(newConv.id);
          sessionStorage.setItem("initialMessage", reply);
        },
      }
    );
  };

  if (activeConversationId) {
    return (
      <ChatInterface
        conversationId={activeConversationId}
        onBack={() => setActiveConversationId(null)}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-[calc(100vh-8rem)] flex flex-col">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-secondary/10 rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-secondary" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Ask The Guide</h1>
        <p className="text-muted-foreground">
          Powered by Google Gemini. Ask anything about the election process.
        </p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6">
        <Card className="flex-1 flex flex-col overflow-hidden border-2">
          <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
            <h2 className="font-semibold font-serif">Recent Conversations</h2>
            <Button
              onClick={handleCreateNew}
              size="sm"
              className="gap-2"
              disabled={createConversation.isPending}
            >
              {createConversation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              New Chat
            </Button>
          </div>
          <ScrollArea className="flex-1 p-4">
            {loadingConversations ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : conversations?.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Bot className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No conversations yet.</p>
                <p className="text-sm">Start a new chat to ask your questions.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {conversations?.map((conv) => (
                  <div key={conv.id} className="flex items-center gap-2 group">
                    <Button
                      variant="outline"
                      className="flex-1 justify-start font-normal"
                      onClick={() => setActiveConversationId(conv.id)}
                    >
                      <MessageSquareIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="truncate">{conv.title || "Conversation"}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 text-destructive"
                      onClick={() => handleDelete(conv.id)}
                      disabled={deleteConversation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>

        <div className="flex-1 flex flex-col justify-center items-center text-center p-6 bg-muted/20 rounded-xl border border-dashed">
          <h3 className="font-semibold text-lg mb-4">Common Questions</h3>
          <div className="flex flex-col gap-2 w-full max-w-sm">
            {QUICK_REPLIES.map((reply) => (
              <Button
                key={reply}
                variant="secondary"
                className="w-full justify-start text-left h-auto py-3 px-4 whitespace-normal"
                onClick={() => handleQuickReply(reply)}
                disabled={createConversation.isPending}
              >
                {reply}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-6 max-w-xs">
            Powered by Google Gemini. Strictly nonpartisan — no party opinions or political bias.
          </p>
        </div>
      </div>
    </div>
  );
}

function ChatInterface({
  conversationId,
  onBack,
}: {
  conversationId: number;
  onBack: () => void;
}) {
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamContent, setStreamContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: conversation, isLoading } = useGetGeminiConversation(conversationId, {
    query: {
      enabled: !!conversationId,
      queryKey: getGetGeminiConversationQueryKey(conversationId),
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation?.messages, streamContent]);

  useEffect(() => {
    const initialMsg = sessionStorage.getItem("initialMessage");
    if (initialMsg && !isLoading && conversation?.messages?.length === 0) {
      sessionStorage.removeItem("initialMessage");
      handleSend(initialMsg);
    }
  }, [isLoading, conversation?.messages?.length]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const messageToSend = text;
    setInputValue("");
    setIsStreaming(true);
    setStreamContent("");

    queryClient.setQueryData(
      getGetGeminiConversationQueryKey(conversationId),
      (oldData: { messages: Array<{ id: number; role: string; content: string; createdAt: string }> } | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          messages: [
            ...oldData.messages,
            {
              id: Date.now(),
              role: "user",
              content: messageToSend,
              createdAt: new Date().toISOString(),
            },
          ],
        };
      }
    );

    try {
      const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
      const response = await fetch(
        `${BASE}/api/gemini/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: messageToSend }),
        }
      );

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.replace("data: ", "");
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  assistantMessage += parsed.content;
                  setStreamContent(assistantMessage);
                }
              } catch {
                // ignore partial chunk parse errors
              }
            }
          }
        }
      }

      queryClient.invalidateQueries({
        queryKey: getGetGeminiConversationQueryKey(conversationId),
      });
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsStreaming(false);
      setStreamContent("");
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-4xl h-[calc(100vh-5rem)] flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-serif font-bold flex-1 truncate">
          {conversation?.title || "Ask The Guide"}
        </h2>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
          Powered by Gemini
        </span>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-2 shadow-sm">
        <ScrollArea className="flex-1 p-4" viewportRef={scrollRef}>
          <div className="space-y-6 pb-4">
            {conversation?.messages?.length === 0 && !isStreaming && (
              <div className="text-center py-10 px-4 max-w-md mx-auto">
                <Bot className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Hello! I'm your Election Guide.</h3>
                <p className="text-muted-foreground text-sm">
                  I can help answer questions about voter registration, polling booths, required
                  documents, and the overall election process in India. Powered by Google Gemini.
                </p>
              </div>
            )}

            <AnimatePresence initial={false}>
              {conversation?.messages?.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <Bot className="w-5 h-5" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted rounded-tl-none border"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </motion.div>
              ))}

              {isStreaming && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="max-w-[80%] rounded-2xl p-4 bg-muted rounded-tl-none border">
                    {streamContent ? (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{streamContent}</p>
                    ) : (
                      <div className="flex gap-1 items-center h-5">
                        <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" />
                        <span
                          className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                        <span
                          className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>

        <div className="p-4 bg-background border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputValue);
            }}
            className="flex gap-2"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about elections, voting, registration..."
              className="flex-1"
              disabled={isStreaming}
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || isStreaming}
              className="gap-2 shrink-0"
            >
              {isStreaming ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Send</span>
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-3">
            For official decisions, always verify with the Election Commission of India at eci.gov.in
            or call Voter Helpline 1950.
          </p>
        </div>
      </Card>
    </div>
  );
}

function MessageSquareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
