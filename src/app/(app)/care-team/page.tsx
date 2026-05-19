import { auth } from "@/lib/auth";
import { getCareTeamMembers } from "@/lib/ms-data";
import { addCareTeamMember } from "@/app/actions/ms";
import { Button } from "@/components/ui/button";
import { SafetyFooter } from "@/components/layout/safety-footer";
import { Download, Users } from "lucide-react";

export default async function CareTeamPage() {
  const session = await auth();
  const members = await getCareTeamMembers(session!.user!.id);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Care team</h1>
        <p className="mt-1 text-[var(--color-fg-muted)]">
          Share summaries with your neurologist, MS nurse, or family.
        </p>
      </header>

      <section className="glass rounded-3xl p-6">
        <div className="flex items-center gap-3">
          <Download className="h-6 w-6 text-[var(--color-primary)]" />
          <div className="flex-1">
            <h2 className="font-semibold text-white">Export summary (PDF)</h2>
            <p className="text-sm text-[var(--color-fg-muted)]">
              Last 30 days of check-ins, symptoms, medications, and relapses.
            </p>
          </div>
        </div>
        <a
          href="/api/export/summary.pdf"
          className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-[var(--color-primary)] text-base font-semibold text-[#0a1024] sm:w-auto sm:px-8"
        >
          Download PDF
        </a>
      </section>

      <section className="glass rounded-3xl p-6">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-[var(--color-violet)]" />
          <h2 className="font-semibold text-white">Care team members</h2>
        </div>
        {members.length === 0 ? (
          <p className="text-sm text-[var(--color-fg-muted)]">
            No members added yet. Add someone who can view your summary.
          </p>
        ) : (
          <ul className="space-y-3">
            {members.map((m) => (
              <li
                key={m.id}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <p className="font-medium text-white">{m.name}</p>
                <p className="text-xs text-[var(--color-fg-muted)]">
                  {m.role} · {m.permissions.replace("_", " ")}
                </p>
                {m.email && (
                  <p className="text-xs text-[var(--color-fg-subtle)]">{m.email}</p>
                )}
              </li>
            ))}
          </ul>
        )}

        <form action={addCareTeamMember} className="mt-6 space-y-3 border-t border-white/10 pt-6">
          <h3 className="text-sm font-medium text-white">Add member</h3>
          <input
            name="name"
            required
            placeholder="Name"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40"
          />
          <input
            name="role"
            required
            placeholder="Role (e.g. Neurologist, Partner)"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40"
          />
          <input
            name="email"
            type="email"
            placeholder="Email (optional)"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40"
          />
          <select
            name="permissions"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white"
          >
            <option value="view_summary" className="bg-[#1a2548]">
              View summary only
            </option>
            <option value="view_full" className="bg-[#1a2548]">
              View full timeline
            </option>
          </select>
          <Button type="submit" className="w-full">
            Add to care team
          </Button>
        </form>
      </section>

      <SafetyFooter />
    </div>
  );
}
