import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { getExportSummaryData } from "@/lib/ms-data";

type ExportData = Awaited<ReturnType<typeof getExportSummaryData>>;

export async function generateSummaryPdf(data: ExportData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page = doc.addPage([595, 842]);
  const { width, height } = page.getSize();
  let y = height - 50;
  const margin = 50;
  const lineHeight = 16;

  function addLine(text: string, size = 11, useBold = false) {
    if (y < 60) {
      page = doc.addPage([595, 842]);
      y = height - 50;
    }
    page.drawText(text, {
      x: margin,
      y,
      size,
      font: useBold ? bold : font,
      color: rgb(0.1, 0.1, 0.2),
      maxWidth: width - margin * 2,
    });
    y -= lineHeight + (size > 11 ? 4 : 0);
  }

  addLine("Lumen — Care Team Summary", 18, true);
  addLine(`Generated: ${new Date().toLocaleDateString("en-GB")}`, 10);
  addLine(`Patient: ${data.user?.name ?? "Unknown"}`, 12, true);
  addLine("");

  if (data.profile) {
    addLine("MS Profile", 14, true);
    addLine(`Type: ${data.profile.msType}`);
    addLine(
      `Diagnosis: ${data.profile.diagnosisDate?.toLocaleDateString("en-GB") ?? "Not specified"}`,
    );
    addLine(`Current DMT: ${data.profile.currentDMT ?? "Not specified"}`);
    addLine("");
  }

  addLine("Daily Check-ins (last 30 days)", 14, true);
  if (data.checkIns.length === 0) {
    addLine("No check-ins recorded.");
  } else {
    for (const c of data.checkIns) {
      addLine(
        `${c.date.toLocaleDateString("en-GB")} — Energy ${c.energy}/10, Mood ${c.mood}/10, Pain ${c.pain}/10, Brain fog ${c.brainFog}/10`,
      );
    }
  }
  addLine("");

  addLine("Symptom Events", 14, true);
  if (data.symptoms.length === 0) {
    addLine("None logged.");
  } else {
    for (const s of data.symptoms) {
      addLine(
        `${s.startedAt.toLocaleDateString("en-GB")} — ${s.type}, severity ${s.severity}/10`,
      );
    }
  }
  addLine("");

  addLine("Medications", 14, true);
  if (data.medications.length === 0) {
    addLine("None recorded.");
  } else {
    for (const m of data.medications) {
      addLine(`${m.name} (${m.type})${m.dose ? ` — ${m.dose}` : ""}`);
    }
  }
  addLine("");

  addLine("Relapse Events", 14, true);
  if (data.relapses.length === 0) {
    addLine("None logged.");
  } else {
    for (const r of data.relapses) {
      const symptoms = JSON.parse(r.symptoms || "[]").join(", ");
      addLine(
        `${r.startedAt.toLocaleDateString("en-GB")} — Severity ${r.severity}/10. Symptoms: ${symptoms || "unspecified"}`,
      );
    }
  }

  addLine("");
  addLine(
    "Disclaimer: This summary is for informational purposes only and is not medical advice.",
    9,
  );

  return doc.save();
}
