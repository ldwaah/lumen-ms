import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const DEMO_PASSWORD = "learn123";

async function main() {
  await prisma.consentRecord.deleteMany();
  await prisma.careTeamMember.deleteMany();
  await prisma.coachingSession.deleteMany();
  await prisma.coachAvailability.deleteMany();
  await prisma.coach.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.chatThread.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.relapseEvent.deleteMany();
  await prisma.medicationLog.deleteMany();
  await prisma.medication.deleteMany();
  await prisma.symptomEvent.deleteMany();
  await prisma.dailyCheckIn.deleteMany();
  await prisma.mSProfile.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.nuggetProgress.deleteMany();
  await prisma.question.deleteMany();
  await prisma.nugget.deleteMany();
  await prisma.course.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const user = await prisma.user.create({
    data: {
      name: "Alex Morgan",
      email: "alex@lumenlearn.app",
      passwordHash,
      xp: 120,
      currentStreak: 4,
      longestStreak: 12,
      lastActiveAt: new Date(),
    },
  });

  await prisma.mSProfile.create({
    data: {
      userId: user.id,
      msType: "RRMS",
      diagnosisDate: new Date("2022-03-15"),
      currentDMT: "Ocrevus",
      goals: JSON.stringify(["Manage fatigue better", "Prepare for neurology appointment"]),
      onboardingDone: true,
      consentFlags: JSON.stringify({ ai_coach: true, data_export: true }),
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    await prisma.dailyCheckIn.create({
      data: {
        userId: user.id,
        date: d,
        energy: 5 + Math.floor(Math.random() * 4),
        mood: 5 + Math.floor(Math.random() * 3),
        pain: 2 + Math.floor(Math.random() * 4),
        brainFog: 3 + Math.floor(Math.random() * 4),
        sleepHours: 6 + Math.random() * 2,
        stress: 3 + Math.floor(Math.random() * 4),
      },
    });
  }

  await prisma.medication.create({
    data: {
      userId: user.id,
      name: "Ocrevus",
      type: "DMT",
      dose: "600mg infusion",
      schedule: "Every 6 months",
    },
  });

  await prisma.goal.createMany({
    data: [
      { userId: user.id, title: "Build a sustainable daily routine" },
      { userId: user.id, title: "Manage fatigue better" },
    ],
  });

  const livingWithMs = await prisma.subject.create({
    data: {
      name: "Living with MS",
      slug: "living-with-ms",
      color: "#3DA9FF",
      icon: "heart",
      sortOrder: 1,
    },
  });

  const wellness = await prisma.subject.create({
    data: {
      name: "Wellness & energy",
      slug: "wellness",
      color: "#4EE066",
      icon: "leaf",
      sortOrder: 2,
    },
  });

  const first90 = await prisma.course.create({
    data: {
      title: "First 90 Days After Diagnosis",
      description:
        "A gentle guide through the early weeks — understanding MS, building your care team, and finding your footing.",
      subjectId: livingWithMs.id,
      sortOrder: 1,
    },
  });

  const fatigue = await prisma.course.create({
    data: {
      title: "Fatigue Management",
      description:
        "Practical strategies for pacing energy, planning your day, and working with — not against — MS fatigue.",
      subjectId: wellness.id,
      sortOrder: 1,
    },
  });

  const nuggets = [
    {
      courseId: first90.id,
      sortOrder: 1,
      title: "What is MS?",
      summary: "Understand multiple sclerosis in plain language.",
      durationMin: 6,
      content: `## Multiple sclerosis in simple terms

**MS** is a condition where your immune system mistakenly attacks the protective coating (myelin) around nerve fibres in your brain and spinal cord.

### Key points
- MS is **not contagious** and is not your fault.
- It affects everyone differently — no two journeys are identical.
- Treatments (DMTs) can reduce relapses and slow progression for many people.
- A good **care team** (neurologist, MS nurse, physio, etc.) makes a huge difference.

### What you might feel
Fatigue, numbness, vision changes, balance issues, brain fog — but symptoms vary widely.

**Remember:** A diagnosis is the start of learning to live well with MS, not an endpoint.`,
      questions: [
        {
          prompt: "MS primarily affects which part of the nervous system?",
          options: JSON.stringify([
            "Only the muscles directly",
            "The brain and spinal cord",
            "The digestive system",
            "The heart only",
          ]),
          correctIndex: 1,
          explanation: "MS involves the central nervous system — brain and spinal cord.",
        },
      ],
    },
    {
      courseId: first90.id,
      sortOrder: 2,
      title: "Building Your Care Team",
      summary: "Who should be on your MS team and how to work with them.",
      durationMin: 8,
      content: `## Your MS care team

You don't have to navigate this alone. A strong team might include:

| Role | How they help |
|------|---------------|
| **Neurologist** | Diagnosis, DMTs, relapse management |
| **MS nurse specialist** | Day-to-day questions, injections, support |
| **GP** | General health, referrals, prescriptions |
| **Physiotherapist** | Mobility, strength, balance |
| **Occupational therapist** | Daily living, workplace adjustments |
| **Psychologist / counsellor** | Emotional wellbeing |

### Tips for appointments
- Keep a **symptom diary** (Lumen's tracker helps!)
- Write questions down before you go
- Bring someone for support if you'd like
- Ask for a written summary after visits`,
      questions: [
        {
          prompt: "Which professional typically manages DMT prescriptions?",
          options: JSON.stringify(["Physiotherapist", "Neurologist", "Dentist", "Pharmacist only"]),
          correctIndex: 1,
          explanation: "Neurologists lead MS treatment including DMT decisions.",
        },
      ],
    },
    {
      courseId: first90.id,
      sortOrder: 3,
      title: "Understanding Relapses",
      summary: "What relapses are, when to seek help, and how to track them.",
      durationMin: 7,
      content: `## What is a relapse?

A **relapse** (also called a flare or attack) is new symptoms or worsening of old symptoms lasting **at least 24 hours**, usually after a period of stability, with no infection or fever.

### When to contact your team
- New symptoms lasting more than 24–48 hours
- Significant worsening of existing symptoms
- Symptoms affecting daily function

### Tracking helps
Log when symptoms started, what you noticed, and whether steroids were used. This gives your neurologist valuable information.

**Important:** Sudden severe symptoms (vision loss, severe weakness, bladder retention) need urgent medical attention.`,
      questions: [
        {
          prompt: "A relapse typically lasts at least…",
          options: JSON.stringify(["1 hour", "24 hours", "1 week minimum always", "6 months"]),
          correctIndex: 1,
          explanation: "The 24-hour rule helps distinguish relapses from temporary symptom fluctuations.",
        },
      ],
    },
    {
      courseId: fatigue.id,
      sortOrder: 1,
      title: "Understanding MS Fatigue",
      summary: "Why MS fatigue is different and why rest alone isn't enough.",
      durationMin: 6,
      content: `## MS fatigue is real — and different

MS fatigue isn't just being tired. It's often:
- **Overwhelming** — not relieved by a good night's sleep
- **Disproportionate** — small tasks can wipe you out
- **Unpredictable** — good days and bad days

### The spoon theory
Imagine you start each day with a limited number of "spoons" (energy units). Every activity costs spoons. MS means you often have fewer spoons than others.

### Key insight
**Pacing** beats pushing through. Saving energy for what matters most is a skill, not laziness.`,
      questions: [
        {
          prompt: "MS fatigue is best described as…",
          options: JSON.stringify([
            "Only caused by poor sleep",
            "Often disproportionate to activity and not always fixed by rest",
            "The same as normal tiredness",
            "Not a real symptom",
          ]),
          correctIndex: 1,
          explanation: "MS fatigue has unique qualities that make pacing strategies essential.",
        },
      ],
    },
    {
      courseId: fatigue.id,
      sortOrder: 2,
      title: "Energy Pacing Basics",
      summary: "Learn the 50/10 rule and how to plan your day around energy.",
      durationMin: 8,
      content: `## Pacing strategies that work

### The 50/10 rule
Work at about **50%** of what you think you can do, then **rest for 10 minutes** before continuing. This prevents the boom-bust cycle.

### Plan your day
1. List what you need to do
2. Rank by importance
3. Put demanding tasks in your **best energy window** (often morning)
4. Build in rest breaks — they're productive, not wasted time

### Micro-actions
On low-energy days, one small win counts: a 5-minute stretch, one check-in, one message to a friend.`,
      questions: [
        {
          prompt: "The 50/10 rule suggests working at about…",
          options: JSON.stringify([
            "100% capacity then resting all day",
            "50% of perceived capacity with regular breaks",
            "No activity at all",
            "Only exercising for 50 minutes",
          ]),
          correctIndex: 1,
          explanation: "Working below your perceived limit helps avoid energy crashes later.",
        },
      ],
    },
    {
      courseId: fatigue.id,
      sortOrder: 3,
      title: "Sleep & MS Fatigue",
      summary: "How sleep hygiene supports energy — without promising a cure.",
      durationMin: 7,
      content: `## Sleep and MS

Poor sleep can worsen fatigue, spasticity, pain, and mood. MS can also disrupt sleep directly (pain, bladder urgency, restless legs).

### Sleep hygiene tips
- Consistent wake time (even on weekends)
- Cool, dark bedroom
- Limit screens 1 hour before bed
- Avoid caffeine after 2pm
- Gentle evening routine (stretching, reading)

### When to ask for help
If snoring, gasping, or extreme daytime sleepiness occur, ask about **sleep apnoea** screening.

Track your sleep in Lumen's daily check-in to spot patterns.`,
      questions: [
        {
          prompt: "Good sleep hygiene includes…",
          options: JSON.stringify([
            "Irregular bedtimes each night",
            "Caffeine before bed",
            "A consistent wake time",
            "Screens in bed for an hour",
          ]),
          correctIndex: 2,
          explanation: "Consistent wake times help regulate your body clock.",
        },
      ],
    },
  ];

  for (const n of nuggets) {
    const { questions, ...data } = n;
    await prisma.nugget.create({
      data: {
        ...data,
        questions: {
          create: questions.map((q, i) => ({ ...q, sortOrder: i + 1 })),
        },
      },
    });
  }

  await prisma.coach.createMany({
    data: [
      {
        name: "Dr. Sarah Chen",
        title: "MS Specialist Nurse",
        bio: "15 years supporting people with MS through diagnosis, treatment, and daily life.",
        specialties: JSON.stringify(["Newly diagnosed", "DMT support", "Relapse management"]),
        calComUrl: "https://cal.com",
      },
      {
        name: "James Okonkwo",
        title: "Neuro Physiotherapist",
        bio: "Helps people with MS stay mobile, build strength, and manage spasticity.",
        specialties: JSON.stringify(["Mobility", "Exercise pacing", "Balance"]),
        calComUrl: "https://cal.com",
      },
      {
        name: "Emma Walsh",
        title: "MS Psychologist",
        bio: "Supports emotional wellbeing, anxiety, and adjustment to life with MS.",
        specialties: JSON.stringify(["Mental health", "Workplace", "Relationships"]),
        calComUrl: "https://cal.com",
      },
    ],
  });

  console.log("Seed complete. Demo login: alex@lumenlearn.app / learn123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
