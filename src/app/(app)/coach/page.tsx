import { auth } from "@/lib/auth";
import { getOrCreateChatThread } from "@/lib/ms-data";
import { CoachChat } from "@/components/coach/coach-chat";
import { SafetyFooter } from "@/components/layout/safety-footer";

export default async function CoachPage() {
  const session = await auth();
  const thread = await getOrCreateChatThread(session!.user!.id);

  return (
    <div>
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-white">AI Coach</h1>
        <p className="text-sm text-[var(--color-fg-muted)]">
          Supportive coaching — not medical advice. Your clinician knows your
          health best.
        </p>
      </header>
      <CoachChat
        threadId={thread.id}
        initialMessages={thread.messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          safetyFlag: m.safetyFlag,
        }))}
      />
      <SafetyFooter />
    </div>
  );
}
