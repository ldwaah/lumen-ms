"use client";

import { useState, useTransition } from "react";
import { Download, Trash2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteMyAccount } from "@/app/actions/ms";

export function DataRightsSection() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const canDelete = confirmText.trim() === "DELETE";

  function handleDelete() {
    if (!canDelete) return;
    setError(null);
    startTransition(async () => {
      try {
        await deleteMyAccount();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
        );
      }
    });
  }

  return (
    <section className="glass rounded-2xl p-5">
      <div className="mb-3 flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-[var(--color-primary)]" />
        <h2 className="font-semibold text-white">Your data</h2>
      </div>
      <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
        You own your data. Export everything, or remove your account entirely.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <a
          href="/api/export/data.json"
          className="flex-1"
          download
        >
          <Button type="button" variant="outline" className="w-full">
            <Download className="h-4 w-4" /> Export all my data
          </Button>
        </a>
        <Button
          type="button"
          variant="danger"
          className="flex-1"
          onClick={() => {
            setError(null);
            setConfirmText("");
            setConfirmOpen(true);
          }}
        >
          <Trash2 className="h-4 w-4" /> Delete my account
        </Button>
      </div>

      {confirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <div className="glass w-full max-w-md rounded-2xl border border-white/10 p-6">
            <h3
              id="delete-account-title"
              className="mb-2 text-lg font-semibold text-white"
            >
              Delete your account?
            </h3>
            <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
              This permanently deletes your account, all check-ins, symptom
              logs, medications, coach conversations, and care team. This cannot
              be undone.
            </p>
            <label
              htmlFor="confirm-delete"
              className="mb-2 block text-sm text-white"
            >
              Type <span className="font-mono font-semibold">DELETE</span> to
              confirm
            </label>
            <input
              id="confirm-delete"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              autoComplete="off"
              autoFocus
              className="mb-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40"
              placeholder="DELETE"
              disabled={isPending}
            />
            {error && (
              <p className="mb-3 text-sm text-[var(--color-danger)]">{error}</p>
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={() => setConfirmOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                className="flex-1"
                onClick={handleDelete}
                disabled={!canDelete || isPending}
              >
                {isPending ? "Deleting..." : "Delete forever"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
