import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { buildCoachContext } from "@/lib/ms-data";
import { COACH_SYSTEM_PROMPT } from "@/lib/coach-prompt";
import { checkMessageSafety } from "@/lib/safety";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextResponse } from "next/server";

export const maxDuration = 30;

const MOCK_RESPONSES: Record<string, string> = {
  default:
    "Thank you for sharing. Based on what you've told me, I'd suggest focusing on one small, achievable step today. Remember — pacing your energy is one of the most powerful tools you have with MS. Would you like to explore fatigue strategies or prepare for an appointment?",
  fatigue:
    "MS fatigue responds well to pacing. Try the 50/10 rule: work at about half your perceived capacity, then rest for 10 minutes. On low-energy days, one micro-action — a short walk, a check-in, or a gentle stretch — still counts as progress.",
  neurologist:
    "Great idea to prepare questions. Consider asking: Are my current symptoms consistent with my MS type? Should we review my DMT? What should I do if symptoms worsen? Would any tests help right now? I can help you refine this list.",
};

function getMockResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("fatigue") || lower.includes("pace")) return MOCK_RESPONSES.fatigue;
  if (lower.includes("neurolog") || lower.includes("appointment"))
    return MOCK_RESPONSES.neurologist;
  return MOCK_RESPONSES.default;
}

function buildMockStream(
  fullText: string,
  threadId: string,
  persist: (content: string) => Promise<void>,
): Response {
  const encoder = new TextEncoder();
  const tokens = fullText.match(/\S+\s*/g) ?? [fullText];

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for (const token of tokens) {
          controller.enqueue(encoder.encode(token));
          await new Promise((resolve) => setTimeout(resolve, 35));
        }
      } finally {
        await persist(fullText);
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Thread-Id": threadId,
    },
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { message, threadId } = await req.json();

  if (!message?.trim()) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  const safety = checkMessageSafety(message);
  if (safety.type !== "ok") {
    const content = safety.message;
    let thread = threadId
      ? await prisma.chatThread.findFirst({ where: { id: threadId, userId } })
      : null;

    if (!thread) {
      thread = await prisma.chatThread.create({ data: { userId } });
    }

    await prisma.chatMessage.createMany({
      data: [
        { threadId: thread.id, role: "user", content: message },
        {
          threadId: thread.id,
          role: "assistant",
          content,
          safetyFlag: safety.type,
        },
      ],
    });

    return NextResponse.json({
      content,
      safetyFlag: safety.type,
      threadId: thread.id,
    });
  }

  let thread = threadId
    ? await prisma.chatThread.findFirst({ where: { id: threadId, userId } })
    : null;

  if (!thread) {
    thread = await prisma.chatThread.create({ data: { userId } });
  }

  await prisma.chatMessage.create({
    data: { threadId: thread.id, role: "user", content: message },
  });

  const threadIdForCallback = thread.id;
  const persistAssistant = async (content: string) => {
    try {
      await prisma.chatMessage.create({
        data: { threadId: threadIdForCallback, role: "assistant", content },
      });
    } catch (err) {
      console.error("Failed to persist assistant message", err);
    }
  };

  if (!process.env.OPENAI_API_KEY) {
    return buildMockStream(getMockResponse(message), thread.id, persistAssistant);
  }

  const context = await buildCoachContext(userId);
  const recentMessages = await prisma.chatMessage.findMany({
    where: { threadId: thread.id },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: `${COACH_SYSTEM_PROMPT}\n\nUser context:\n${context}`,
    messages: recentMessages.reverse().map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    onFinish: async ({ text }) => {
      await persistAssistant(text);
    },
  });

  return result.toTextStreamResponse({
    headers: {
      "X-Thread-Id": thread.id,
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
