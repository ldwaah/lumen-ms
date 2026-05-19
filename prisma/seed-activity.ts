import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: "alex@lumenlearn.app" },
  });
  if (!user) {
    console.log("Demo user not found; run seed.ts first.");
    return;
  }

  await prisma.activityLog.deleteMany({ where: { userId: user.id } });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Sprinkle realistic-looking activity across the last 21 days
  const pattern = [
    1, 0, 1, 2, 1, 0, 2, // days 21-15 ago
    1, 1, 0, 2, 3, 1, 0,
    2, 1, 1, 0, 2, 1, 3,
  ];

  let totalXp = 0;
  const today0 = startOfToday();
  for (let i = 0; i < pattern.length; i++) {
    const nuggets = pattern[i];
    if (nuggets === 0) continue;
    const date = new Date(today0);
    date.setDate(date.getDate() - (pattern.length - 1 - i));
    const xp = nuggets * (50 + Math.floor(Math.random() * 25));
    const minutes = nuggets * (6 + Math.floor(Math.random() * 5));
    totalXp += xp;
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        date,
        nuggetsCompleted: nuggets,
        minutesStudied: minutes,
        xpEarned: xp,
      },
    });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      xp: totalXp,
      lastActiveAt: today0,
    },
  });

  console.log(
    `Activity seeded for demo user. Total XP = ${totalXp} across ${pattern.filter((n) => n > 0).length} active days.`,
  );
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
