"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { COACH_QUICK_PROMPTS } from "@/lib/ms-types";
import { clearChatHistory } from "@/app/actions/ms";
import { Send, Trash2 } from "lucide-react";

interface Message {
  id: string;
  role: string;
  content: string;
  safetyFlag?: string | null;
}

interface Props {
  initialMessages: Message[];
  threadId: string;
}

export function CoachChat({ initialMessages, threadId: initialThreadId }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const threadIdRef = useRef<string>(initialThreadId);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    setStreaming(false);

    try {
      const res = await fetch("/api/coach/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, threadId: threadIdRef.current }),
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const headerThreadId = res.headers.get("X-Thread-Id");
      if (headerThreadId) {
        threadIdRef.current = headerThreadId;
      }

      const contentType = res.headers.get("Content-Type") ?? "";

      if (contentType.includes("application/json")) {
        const data = await res.json();
        if (data.threadId) {
          threadIdRef.current = data.threadId;
        }
        if (data.safetyFlag) {
          setMessages((m) => [
            ...m,
            {
              id: `safety-${Date.now()}`,
              role: "assistant",
              content: data.content,
              safetyFlag: data.safetyFlag,
            },
          ]);
        } else if (data.content) {
          setMessages((m) => [
            ...m,
            {
              id: `assistant-${Date.now()}`,
              role: "assistant",
              content: data.content,
            },
          ]);
        }
        setLoading(false);
        router.refresh();
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      const assistantId = `assistant-${Date.now()}`;
      let accumulated = "";
      let firstChunk = true;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;
        accumulated += chunk;

        if (firstChunk) {
          firstChunk = false;
          setLoading(false);
          setStreaming(true);
          setMessages((m) => [
            ...m,
            { id: assistantId, role: "assistant", content: accumulated },
          ]);
        } else {
          setMessages((m) =>
            m.map((msg) =>
              msg.id === assistantId ? { ...msg, content: accumulated } : msg,
            ),
          );
        }
      }

      const tail = decoder.decode();
      if (tail) {
        accumulated += tail;
        setMessages((m) =>
          m.map((msg) =>
            msg.id === assistantId ? { ...msg, content: accumulated } : msg,
          ),
        );
      }

      if (firstChunk) {
        setMessages((m) => [
          ...m,
          {
            id: assistantId,
            role: "assistant",
            content: accumulated || "(no response)",
          },
        ]);
      }

      setStreaming(false);
      setLoading(false);
      router.refresh();
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content:
            "Sorry, I couldn't respond right now. Please try again in a moment.",
        },
      ]);
      setStreaming(false);
      setLoading(false);
    }
  }

  const showThinking = loading && !streaming;
  const inputDisabled = loading || streaming;

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col md:h-[calc(100vh-8rem)]">
      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-white/10 bg-white/5 p-4">
        {messages.length === 0 && (
          <div className="text-center text-sm text-[var(--color-fg-muted)]">
            <p className="mb-4">Hi — I&apos;m your Lumen coach. How can I help today?</p>
            <div className="flex flex-wrap justify-center gap-2">
              {COACH_QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => sendMessage(p)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white hover:bg-white/10"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === "user"
                  ? "bg-[var(--color-primary)] text-[#0a1024]"
                  : msg.safetyFlag
                    ? "border border-[var(--color-warning)]/50 bg-[var(--color-warning)]/10 text-white"
                    : "bg-white/10 text-white"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {showThinking && (
          <p className="text-sm text-[var(--color-fg-muted)]">Thinking…</p>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="mt-4 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your coach…"
          className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40"
          disabled={inputDisabled}
        />
        <Button type="submit" size="icon" disabled={inputDisabled || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Clear conversation"
          onClick={async () => {
            await clearChatHistory();
            setMessages([]);
            router.refresh();
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
