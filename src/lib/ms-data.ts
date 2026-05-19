import { startOfDay, subDays } from "date-fns";
import { prisma } from "@/lib/db";

export async function getMSProfile(userId: string) {
  return prisma.mSProfile.findUnique({ where: { userId } });
}

export async function ensureMSProfile(userId: string) {
  return prisma.mSProfile.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}

export async function getTodayCheckIn(userId: string) {
  const today = startOfDay(new Date());
  return prisma.dailyCheckIn.findUnique({
    where: { userId_date: { userId, date: today } },
  });
}

export async function getRecentCheckIns(userId: string, days = 30) {
  const since = startOfDay(subDays(new Date(), days));
  return prisma.dailyCheckIn.findMany({
    where: { userId, date: { gte: since } },
    orderBy: { date: "asc" },
  });
}

export async function getSymptomEvents(userId: string, limit = 20) {
  return prisma.symptomEvent.findMany({
    where: { userId },
    orderBy: { startedAt: "desc" },
    take: limit,
  });
}

export async function getMedications(userId: string) {
  return prisma.medication.findMany({
    where: { userId, active: true },
    include: { logs: { orderBy: { takenAt: "desc" }, take: 5 } },
    orderBy: { createdAt: "asc" },
  });
}

export async function getRelapseEvents(userId: string, limit = 10) {
  return prisma.relapseEvent.findMany({
    where: { userId },
    orderBy: { startedAt: "desc" },
    take: limit,
  });
}

export async function getUserGoals(userId: string) {
  return prisma.goal.findMany({
    where: { userId, completed: false },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrCreateChatThread(userId: string) {
  const existing = await prisma.chatThread.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: { orderBy: { createdAt: "asc" }, take: 50 },
    },
  });
  if (existing) return existing;

  return prisma.chatThread.create({
    data: { userId },
    include: { messages: true },
  });
}

export async function getCoaches() {
  return prisma.coach.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });
}

export async function getUserSessions(userId: string) {
  return prisma.coachingSession.findMany({
    where: { userId },
    include: { coach: true },
    orderBy: { scheduledAt: "desc" },
    take: 10,
  });
}

export async function getCareTeamMembers(userId: string) {
  return prisma.careTeamMember.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
}

export async function buildCoachContext(userId: string) {
  const [profile, checkIns, goals, continueNugget] = await Promise.all([
    getMSProfile(userId),
    getRecentCheckIns(userId, 14),
    getUserGoals(userId),
    prisma.nuggetProgress.findFirst({
      where: { userId, completed: false },
      include: {
        nugget: { include: { course: { include: { subject: true } } } },
      },
    }),
  ]);

  const profileBlock = profile
    ? `MS type: ${profile.msType}
Diagnosis: ${profile.diagnosisDate ? profile.diagnosisDate.toISOString().slice(0, 10) : "not specified"}
Current DMT: ${profile.currentDMT ?? "not specified"}
Low energy mode: ${profile.lowEnergyMode ? "on" : "off"}`
    : "Profile not yet completed.";

  const checkInBlock =
    checkIns.length > 0
      ? checkIns
          .map(
            (c) =>
              `${c.date.toISOString().slice(0, 10)}: energy ${c.energy}/10, mood ${c.mood}/10, pain ${c.pain}/10, brain fog ${c.brainFog}/10`,
          )
          .join("\n")
      : "No recent check-ins.";

  const goalsBlock =
    goals.length > 0
      ? goals.map((g) => `- ${g.title}`).join("\n")
      : "No active goals set.";

  const programBlock = continueNugget
    ? `Current program step: "${continueNugget.nugget.title}" (${continueNugget.nugget.course.title})`
    : "No active program step.";

  return `${profileBlock}

Recent check-ins (last 14 days):
${checkInBlock}

Active goals:
${goalsBlock}

${programBlock}`;
}

export async function getExportSummaryData(userId: string) {
  const since = startOfDay(subDays(new Date(), 30));
  const [user, profile, checkIns, symptoms, medications, relapses] =
    await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      getMSProfile(userId),
      prisma.dailyCheckIn.findMany({
        where: { userId, date: { gte: since } },
        orderBy: { date: "asc" },
      }),
      prisma.symptomEvent.findMany({
        where: { userId, startedAt: { gte: since } },
        orderBy: { startedAt: "desc" },
      }),
      prisma.medication.findMany({
        where: { userId },
        include: {
          logs: { where: { takenAt: { gte: since } }, orderBy: { takenAt: "desc" } },
        },
      }),
      prisma.relapseEvent.findMany({
        where: { userId, startedAt: { gte: since } },
        orderBy: { startedAt: "desc" },
      }),
    ]);

  return { user, profile, checkIns, symptoms, medications, relapses, since };
}
