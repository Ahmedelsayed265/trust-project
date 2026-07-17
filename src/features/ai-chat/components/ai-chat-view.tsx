"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUp, Bot, Sparkles, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/shared/components/page-header";
import { routes } from "@/shared/lib/routes";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const starterSuggestions = [
  "What's the outlook for BTC today?",
  "Explain my strongest AI signal",
  "How should I size a trade?",
  "Summarize my portfolio risk",
];

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hi — I'm your TrustAI assistant. Ask about markets, signals, portfolio risk, or how to use the platform.",
  },
];

function buildReply(prompt: string) {
  const text = prompt.toLowerCase();

  if (text.includes("btc") || text.includes("bitcoin")) {
    return "BTC is holding above recent support with constructive momentum. Confidence on the latest long setup is around 78%. Consider waiting for a pullback into your planned entry zone before sizing up.";
  }

  if (text.includes("signal")) {
    return "Your strongest open signal is BTC/USDT Buy at Strong confidence. ETH looks moderate, while SOL is more of a watch setup. I can break down entries, stops, or position size next.";
  }

  if (text.includes("size") || text.includes("risk")) {
    return "A common approach is risking 0.5–1% of equity per idea. For a $24.5k portfolio, that is roughly $122–$245 risk. Set stop distance first, then back into position size.";
  }

  if (text.includes("portfolio")) {
    return "Your portfolio is up today with crypto still the main driver. Concentration looks elevated in BTC/ETH, so avoid stacking highly correlated longs unless conviction is strong.";
  }

  return "Got it. I can help with market outlook, AI signals, trade sizing, wallet actions, or account settings. Ask a more specific question and I’ll go deeper.";
}

export function AiChatView() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed || pending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setPending(true);

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: buildReply(trimmed),
        },
      ]);
      setPending(false);
    }, 650);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="Chat with AI Assistant"
        description="Ask about markets, signals, risk, and TrustAI features."
        actions={
          <Button
            variant="outline"
            className="rounded-xl"
            nativeButton={false}
            render={<Link href={routes.aiSignals} />}
          >
            <Sparkles />
            View AI Signals
          </Button>
        }
      />

      <Card className="flex min-h-[560px] flex-1 flex-col overflow-hidden">
        <CardContent className="flex min-h-0 flex-1 flex-col gap-0 p-0">
          <div className="border-b border-border px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {starterSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => sendMessage(suggestion)}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 scrollbar-none">
            {messages.map((message) => {
              const isUser = message.role === "user";
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    isUser ? "justify-end" : "justify-start"
                  )}
                >
                  {!isUser && (
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Bot className="size-4" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed sm:max-w-[75%]",
                      isUser
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-muted/40 text-foreground"
                    )}
                  >
                    {message.content}
                  </div>
                  {isUser && (
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                      <UserRound className="size-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {pending && (
              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Bot className="size-4" />
                </div>
                <div className="rounded-2xl border border-border bg-muted/40 px-3.5 py-2.5 text-sm text-muted-foreground">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-border p-3 sm:p-4"
          >
            <div className="flex items-end gap-2 rounded-2xl border border-border bg-background p-2">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage(input);
                  }
                }}
                rows={1}
                placeholder="Ask TrustAI anything..."
                className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-2 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
              />
              <Button
                type="submit"
                size="icon"
                className="size-10 shrink-0 rounded-xl"
                disabled={!input.trim() || pending}
                aria-label="Send message"
              >
                <ArrowUp className="size-4" />
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              AI responses are educational and not financial advice.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
