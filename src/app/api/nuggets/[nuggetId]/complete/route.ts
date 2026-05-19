import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { xpForScore } from "@/lib/utils";
import { startOfDay } from "date-fns";

const schema = z.object({
  score: z.number().min(0).max(100),
  minutesStudied: z.number().min(1).max(120).default(8),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ nuggetId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { nuggetId } = await params;
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const nugget = await prisma.nugget.findUnique({ where: { id: nuggetId } });
  if (!nugget) {
    return NextResponse.json({ error: "Nugget not found" }, { status: 404 });
  }

  const xp = xpForScore(parsed.data.score);
  const now = new Date();
  const today = startOfDay(now);

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let currentStreak = user.currentStreak;
  if (user.lastActiveAt) {
    const last = startOfDay(user.lastActiveAt);
    const diffDays = Math.floor(
      (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays === 1) currentStreak += 1;
    else if (diffDays > 1) currentStreak = 1;
  } else {
    currentStreak = 1;
  }

  const longestStreak = Math.max(user.longestStreak, currentStreak);

  await prisma.$transaction([
    prisma.nuggetProgress.upsert({
      where: {
        userId_nuggetId: { userId: session.user.id, nuggetId },
      },
      create: {
        userId: session.user.id,
        nuggetId,
        completed: true,
        score: parsed.data.score,
        xpEarned: xp,
        completedAt: now,
      },
      update: {
        completed: true,
        score: parsed.data.score,
        xpEarned: xp,
        completedAt: now,
      },
    }),
    prisma.user.update({
      where: { id: session.user.id },
      data: {
        xp: { increment: xp },
        currentStreak,
        longestStreak,
        lastActiveAt: now,
      },
    }),
    prisma.activityLog.upsert({
      where: {
        userId_date: { userId: session.user.id, date: today },
      },
      create: {
        userId: session.user.id,
        date: today,
        nuggetsCompleted: 1,
        minutesStudied: parsed.data.minutesStudied,
        xpEarned: xp,
      },
      update: {
        nuggetsCompleted: { increment: 1 },
        minutesStudied: { increment: parsed.data.minutesStudied },
        xpEarned: { increment: xp },
      },
    }),
  ]);

  return NextResponse.json({ xp, currentStreak, score: parsed.data.score });
}
