import { Badge } from "@/components/ui/Badge";
import { Users, MessageSquare, Shield } from "lucide-react";
import { SafetyFooter } from "@/components/layout/safety-footer";

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Community</h1>
        <p className="mt-1 text-[var(--color-fg-muted)]">
          Connect with others navigating MS — moderated, supportive, and safe.
        </p>
        <Badge tone="info" className="mt-2">
          Phase 2 — coming soon
        </Badge>
      </header>

      <section className="glass rounded-3xl p-6 space-y-4">
        <div className="flex items-start gap-4">
          <Users className="h-6 w-6 shrink-0 text-[var(--color-primary)]" />
          <div>
            <h2 className="font-semibold text-white">Peer groups</h2>
            <p className="text-sm text-[var(--color-fg-muted)]">
              Groups by MS type, life stage, and region. Moderated for safety.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <MessageSquare className="h-6 w-6 shrink-0 text-[var(--color-violet)]" />
          <div>
            <h2 className="font-semibold text-white">Expert AMAs</h2>
            <p className="text-sm text-[var(--color-fg-muted)]">
              Monthly Q&A sessions with MS nurses, physios, and psychologists.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <Shield className="h-6 w-6 shrink-0 text-[var(--color-success)]" />
          <div>
            <h2 className="font-semibold text-white">Accountability buddies</h2>
            <p className="text-sm text-[var(--color-fg-muted)]">
              Optional pairing for gentle check-ins and shared goals.
            </p>
          </div>
        </div>
      </section>

      <p className="text-center text-sm text-[var(--color-fg-subtle)]">
        Community features are in development. Moderation tooling will launch first.
      </p>
      <SafetyFooter />
    </div>
  );
}
