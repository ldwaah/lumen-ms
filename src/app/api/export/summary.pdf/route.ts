import { auth } from "@/lib/auth";
import { getExportSummaryData } from "@/lib/ms-data";
import { generateSummaryPdf } from "@/lib/pdf-export";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await getExportSummaryData(session.user.id);
  const pdfBytes = await generateSummaryPdf(data);

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="lumen-summary-${new Date().toISOString().slice(0, 10)}.pdf"`,
    },
  });
}
