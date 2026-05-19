"use client";

import { captureEvent } from "@/lib/analytics";

export function PdfDownloadLink() {
  return (
    <a
      href="/api/export/summary.pdf"
      onClick={() => {
        captureEvent("pdf_export_downloaded");
      }}
      className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-[var(--color-primary)] text-base font-semibold text-[#0a1024] sm:w-auto sm:px-8"
    >
      Download PDF
    </a>
  );
}
