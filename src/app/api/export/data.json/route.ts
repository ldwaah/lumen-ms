import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  await prisma.consentRecord.create({
    data: { userId, feature: "data_export", granted: true },
  });

  const [
    user,
    msProfile,
    checkIns,
    symptomEvents,
    medications,
    relapseEvents,
    goals,
    chatThreads,
    coachingSessions,
    careTeamMembers,
    consentRecords,
    nuggetProgress,
    activityLog,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        xp: true,
        currentStreak: true,
        longestStreak: true,
        lastActiveAt: true,
        mood: true,
        createdAt: true,
      },
    }),
    prisma.mSProfile.findUnique({ where: { userId } }),
    prisma.dailyCheckIn.findMany({
      where: { userId },
      orderBy: { date: "asc" },
    }),
    prisma.symptomEvent.findMany({
      where: { userId },
      orderBy: { startedAt: "asc" },
    }),
    prisma.medication.findMany({
      where: { userId },
      include: { logs: { orderBy: { takenAt: "asc" } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.relapseEvent.findMany({
      where: { userId },
      orderBy: { startedAt: "asc" },
    }),
    prisma.goal.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
    prisma.chatThread.findMany({
      where: { userId },
      include: { messages: { orderBy: { createdAt: "asc" } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.coachingSession.findMany({
      where: { userId },
      include: { coach: { select: { id: true, name: true, title: true } } },
      orderBy: { scheduledAt: "asc" },
    }),
    prisma.careTeamMember.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    }),
    prisma.consentRecord.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    }),
    prisma.nuggetProgress.findMany({
      where: { userId },
      include: {
        nugget: { select: { id: true, title: true, courseId: true } },
      },
      orderBy: { updatedAt: "asc" },
    }),
    prisma.activityLog.findMany({
      where: { userId },
      orderBy: { date: "asc" },
    }),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    schemaVersion: 1,
    user,
    msProfile,
    dailyCheckIns: checkIns,
    symptomEvents,
    medications,
    relapseEvents,
    goals,
    chatThreads,
    coachingSessions,
    careTeamMembers,
    consentRecords,
    nuggetProgress,
    activityLog,
  };

  const filename = `lumen-data-export-${new Date().toISOString().slice(0, 10)}.json`;

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
