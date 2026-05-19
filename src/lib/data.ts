import { prisma } from "@/lib/db";

export async function getUserStats(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      progress: {
        where: { completed: true },
        include: { nugget: { include: { course: { include: { subject: true } } } } },
      },
      activities: {
        orderBy: { date: "asc" },
        take: 90,
      },
    },
  });
  return user;
}

export async function getSubjectsWithCourses() {
  return prisma.subject.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      courses: {
        orderBy: { sortOrder: "asc" },
        include: {
          _count: { select: { nuggets: true } },
          nuggets: { select: { id: true } },
        },
      },
    },
  });
}

export async function getCourseWithNuggets(courseId: string, userId?: string) {
  return prisma.course.findUnique({
    where: { id: courseId },
    include: {
      subject: true,
      nuggets: {
        orderBy: { sortOrder: "asc" },
        include: {
          progress: userId
            ? { where: { userId } }
            : false,
          _count: { select: { questions: true } },
        },
      },
    },
  });
}

export async function getNuggetForPlayer(nuggetId: string, userId?: string) {
  return prisma.nugget.findUnique({
    where: { id: nuggetId },
    include: {
      course: { include: { subject: true } },
      questions: { orderBy: { sortOrder: "asc" } },
      progress: userId ? { where: { userId } } : false,
    },
  });
}

export async function getRecommendedNuggets(userId: string, limit = 3) {
  const completed = await prisma.nuggetProgress.findMany({
    where: { userId, completed: true },
    select: { nuggetId: true },
  });
  const completedIds = completed.map((p) => p.nuggetId);

  return prisma.nugget.findMany({
    where: completedIds.length ? { id: { notIn: completedIds } } : {},
    orderBy: [{ course: { subject: { sortOrder: "asc" } } }, { sortOrder: "asc" }],
    take: limit,
    include: {
      course: { include: { subject: true } },
      progress: { where: { userId } },
    },
  });
}

export async function getContinueNugget(userId: string) {
  const inProgress = await prisma.nuggetProgress.findFirst({
    where: { userId, completed: false },
    include: {
      nugget: { include: { course: { include: { subject: true } } } },
    },
  });
  if (inProgress) return inProgress.nugget;

  return prisma.nugget.findFirst({
    where: {
      progress: { none: { userId, completed: true } },
    },
    orderBy: [{ course: { subject: { sortOrder: "asc" } } }, { sortOrder: "asc" }],
    include: { course: { include: { subject: true } } },
  });
}

export async function getSubjectMastery(userId: string) {
  const subjects = await prisma.subject.findMany({
    include: {
      courses: {
        include: {
          nuggets: {
            include: {
              progress: { where: { userId, completed: true } },
            },
          },
        },
      },
    },
  });

  return subjects.map((subject) => {
    const allNuggets = subject.courses.flatMap((c) => c.nuggets);
    const total = allNuggets.length;
    const completed = allNuggets.filter((n) => n.progress.length > 0).length;
    const scores = allNuggets
      .flatMap((n) => n.progress)
      .map((p) => p.score ?? 0)
      .filter((s) => s > 0);
    const avgScore =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;
    return {
      id: subject.id,
      name: subject.name,
      color: subject.color,
      total,
      completed,
      mastery: total ? Math.round((completed / total) * 100) : 0,
      avgScore,
    };
  });
}
