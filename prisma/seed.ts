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

  const mindBody = await prisma.subject.create({
    data: {
      name: "Mind & body",
      slug: "mind-body",
      color: "#A98BFF",
      icon: "leaf",
      sortOrder: 3,
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

  const msAtWork = await prisma.course.create({
    data: {
      title: "MS at Work",
      description:
        "Navigate disclosure, adjustments, and energy management so work fits around your life with MS.",
      subjectId: livingWithMs.id,
      sortOrder: 2,
    },
  });

  const talkingToNeurologist = await prisma.course.create({
    data: {
      title: "Talking to Your Neurologist",
      description:
        "Get more from every appointment — prepare well, ask better questions, and capture what matters afterwards.",
      subjectId: livingWithMs.id,
      sortOrder: 3,
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

  const cognition = await prisma.course.create({
    data: {
      title: "Cognition & Brain Fog",
      description:
        "Understand MS-related cognitive changes and build gentle, practical strategies to work around them.",
      subjectId: mindBody.id,
      sortOrder: 1,
    },
  });

  const mentalHealth = await prisma.course.create({
    data: {
      title: "Mental Health & MS",
      description:
        "A compassionate look at adjustment, mood, and when to reach for support — with hope at the centre.",
      subjectId: mindBody.id,
      sortOrder: 2,
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
    {
      courseId: cognition.id,
      sortOrder: 1,
      title: "What MS Cognition Feels Like",
      summary: "Name the experience — slower processing, word-finding, foggy focus — so it feels less personal.",
      durationMin: 6,
      content: `## Cognitive symptoms in MS

Cognitive changes affect around **half** of people with MS at some point. They are a symptom of MS — not a sign you're "losing it".

### Common patterns
- **Slower processing** — thinking takes a beat longer
- **Word-finding pauses** — the word is *right there*
- **Divided attention** — juggling tasks feels harder
- **Working memory dips** — losing the thread mid-sentence
- **Foggy days** — clear one day, hazy the next

### What it isn't
This is usually **not** dementia and not a sign of rapid decline. It tends to fluctuate with fatigue, stress, heat, sleep, and mood.

### A gentler frame
Think of your brain as a busy switchboard with a few rewired connections. The signal still gets through — it sometimes just takes a different route.

Naming the symptom is the first step to working *with* it instead of fighting it.`,
      questions: [
        {
          prompt: "MS-related cognitive symptoms most commonly look like…",
          options: JSON.stringify([
            "Sudden complete memory loss",
            "Slower processing and word-finding pauses that fluctuate",
            "Permanent inability to read or write",
            "Always severe and progressive",
          ]),
          correctIndex: 1,
          explanation: "MS cognition usually fluctuates and centres on speed, attention, and word-finding.",
        },
      ],
    },
    {
      courseId: cognition.id,
      sortOrder: 2,
      title: "Working Around Brain Fog",
      summary: "Simple habits that protect your thinking on foggy days.",
      durationMin: 7,
      content: `## Working with — not against — the fog

Brain fog isn't fixed by trying harder. It often eases when you reduce the **load** on your brain.

### The three Rs
- **Reduce** — fewer tabs, fewer choices, one task at a time
- **Routine** — same time, same place lowers thinking cost
- **Recover** — short brain breaks every 25–45 minutes

### Quick wins for a foggy hour
- Write the next step down before starting
- Read it aloud once
- Set a 20-minute timer, then pause
- Hydrate and stand up

### When fog hits mid-task
Stop. Note where you left off in one sentence. Switch to something easier (a walk, a stretch, a snack) for 10 minutes. Come back.

**Permission slip:** Foggy days don't mean lazy days. They mean today is a smaller-task day.`,
      questions: [
        {
          prompt: "On a foggy day, the kindest strategy is usually to…",
          options: JSON.stringify([
            "Push through harder and skip breaks",
            "Reduce the load, take short breaks, and pick smaller tasks",
            "Stop everything for the whole week",
            "Triple your caffeine intake",
          ]),
          correctIndex: 1,
          explanation: "Reducing cognitive load and pacing breaks tends to bring more out of a foggy day than pushing through.",
        },
      ],
    },
    {
      courseId: cognition.id,
      sortOrder: 3,
      title: "Tools That Help: Lists, Routines, Apps",
      summary: "An external brain — lists, calendars, and apps — that takes the pressure off memory.",
      durationMin: 8,
      content: `## Build an "external brain"

The goal is to **offload** what you'd otherwise have to remember.

### A simple toolkit

| Tool | What it's for |
|------|---------------|
| **One inbox** (phone notes or a single notebook) | Catch every thought in one place |
| **Daily list** (3 priorities) | Decide once, not all day |
| **Shared calendar** | Appointments, meds, refills, reviews |
| **Reminders/alarms** | Meds, hydration, transitions |
| **Voice notes** | When typing feels heavy |

### Routines that lower thinking cost
- Same wake / wind-down times
- A "launch pad" by the door (keys, bag, water)
- A weekly 15-minute review on Sundays

### Try one thing this week
Pick **one** tool. Use it for 7 days before adding anything else. Small consistency beats a perfect system you never use.

> A list isn't a sign of weakness. It's a sign you're respecting your energy.`,
      questions: [
        {
          prompt: "What's the most useful starting point for an 'external brain'?",
          options: JSON.stringify([
            "Five different apps from day one",
            "One inbox and a short daily priorities list",
            "Memorising everything to train your brain",
            "Avoiding lists so you don't get dependent",
          ]),
          correctIndex: 1,
          explanation: "Consolidating into one inbox and a tiny daily list is the lowest-friction place to start.",
        },
      ],
    },
    {
      courseId: msAtWork.id,
      sortOrder: 1,
      title: "Should I Disclose at Work?",
      summary: "There's no single right answer — only the one that fits your role, team, and goals.",
      durationMin: 7,
      content: `## Disclosure is a choice, not a duty

In most places, you do **not** have to tell your employer you have MS. You may choose to disclose to access adjustments or simply to feel more yourself at work.

### Reasons people disclose
- To request **reasonable adjustments**
- To explain time off for appointments or relapses
- To stop hiding feeling drained
- To protect themselves legally if symptoms affect work

### Reasons people wait
- Job is new or precarious
- Symptoms are well managed for now
- They want to think it through first

### Things worth thinking about
- **Who** needs to know? (HR, line manager, whole team — usually fewer is fine)
- **What** do you want to share? (You can share *needs* without a diagnosis)
- **When** is the timing right? (Not during a crisis if you can help it)

There is no "best practice" here — only *your* best practice. Many people start by telling one trusted person.`,
      questions: [
        {
          prompt: "When it comes to telling your employer about MS…",
          options: JSON.stringify([
            "You are legally required to disclose immediately",
            "It's a personal choice, often shaped by adjustments and trust",
            "Everyone on your team must be told",
            "You should never tell anyone at work",
          ]),
          correctIndex: 1,
          explanation: "Disclosure is generally a personal choice, often driven by the need for adjustments or trust with a manager.",
        },
      ],
    },
    {
      courseId: msAtWork.id,
      sortOrder: 2,
      title: "Reasonable Adjustments — What to Ask For",
      summary: "A menu of small, common adjustments that make a real difference at work.",
      durationMin: 8,
      content: `## What "reasonable adjustments" actually means

These are changes an employer makes so the job works for you. They're often **small, free, and quickly implemented**.

### A starter menu

| Area | Possible adjustment |
|------|---------------------|
| **Hours** | Flexible start / finish, compressed week, phased return |
| **Location** | Hybrid or remote days, quiet desk, near toilets |
| **Workload** | Protected focus time, fewer back-to-back meetings |
| **Environment** | Cool space, anti-glare screen, ergonomic chair |
| **Tasks** | Reassigning the most fatiguing duties |
| **Tech** | Voice-to-text, screen reader, larger monitor |

### How to ask
1. Name the need (not the diagnosis, unless you want to)
2. Suggest a specific adjustment
3. Offer a short trial period — "let's try for 6 weeks"
4. Put it in writing afterwards

### Real-world tip
Frame adjustments as **enabling good work**, not as concessions. They usually are.

If you're unsure where to start, an Occupational Health referral can suggest options without you doing all the work.`,
      questions: [
        {
          prompt: "Reasonable adjustments at work are usually…",
          options: JSON.stringify([
            "Always expensive and complicated",
            "Often small, free, and quick to set up",
            "Only available to people who fully disclose every detail",
            "A formal medical procedure",
          ]),
          correctIndex: 1,
          explanation: "Many useful adjustments — flexible hours, quiet space, focus time — cost little and can be trialled quickly.",
        },
      ],
    },
    {
      courseId: msAtWork.id,
      sortOrder: 3,
      title: "Energy Management on the Job",
      summary: "Protect your best hours and shape the workday around your real energy.",
      durationMin: 7,
      content: `## Designing a workday that respects your energy

Most jobs assume a flat energy curve. MS rarely does. The trick is shaping the day around your **actual** energy, not a fictional one.

### Map your energy
For a week, rate your energy 1–10 at:
- 9am
- noon
- 3pm
- 6pm

Patterns usually appear within days.

### Then schedule deliberately
- **Peak energy** → focused work, hard conversations
- **Mid energy** → meetings, admin
- **Low energy** → email, light tasks, recovery

### Small protective habits
- A real break at lunch — away from the screen
- Stand and stretch every hour
- Hydrate (even a sip per task)
- Cool down — fans, a cold drink, a quieter spot

### When you have a bad day
One smaller "must-do", the rest moved. That's not failure — that's strategy.

Energy is a finite resource. Spending it on your priorities is the whole job.`,
      questions: [
        {
          prompt: "A good first step for managing energy at work is to…",
          options: JSON.stringify([
            "Schedule all hard tasks for late afternoon",
            "Track your energy across the day for a week and plan around it",
            "Skip every break to finish earlier",
            "Wait until burnout to make changes",
          ]),
          correctIndex: 1,
          explanation: "A short self-tracking exercise reveals your real energy pattern so you can align demanding work with peak hours.",
        },
      ],
    },
    {
      courseId: talkingToNeurologist.id,
      sortOrder: 1,
      title: "Preparing for the Appointment",
      summary: "A short prep ritual that turns 15 minutes with the neurologist into a useful conversation.",
      durationMin: 6,
      content: `## Preparation is half the appointment

Neurology appointments are short. A little prep goes a long way.

### Two days before
- Skim your **symptom diary** from the last few months
- Note any new or worsening symptoms (and when they started)
- List medications, supplements, and any side effects

### The day before
- Write your **top 3 questions** on one piece of paper
- Pick one issue you most want to leave with an answer about
- Charge your phone (or print) — bring your tracker summary

### Two practical tips
- **Bring someone** if you can — a second pair of ears catches things
- **Ask if you can record** the conversation; many clinicians are happy with this

### A simple prep template
1. What I've noticed since last time…
2. What I'm worried about…
3. What I want to decide today…

Going in clear about your goals shifts the visit from "report card" to "shared decision".`,
      questions: [
        {
          prompt: "The single most useful thing to bring to a neurology appointment is…",
          options: JSON.stringify([
            "A long list of unrelated questions",
            "Your top 3 questions and a brief symptom summary",
            "Nothing — your neurologist remembers everything",
            "All of your old MRI scans on paper",
          ]),
          correctIndex: 1,
          explanation: "A short, prioritised list with a recent symptom summary makes the most of limited appointment time.",
        },
      ],
    },
    {
      courseId: talkingToNeurologist.id,
      sortOrder: 2,
      title: "Questions Worth Asking",
      summary: "A starter set of clear, useful questions you can adapt to your situation.",
      durationMin: 7,
      content: `## Good questions = better care

You don't need to be a clinician. You just need to be **curious about your own care**.

### About your current state
- What does my latest MRI / exam suggest about how my MS is doing?
- Are there changes since last time I should know about?

### About treatment
- Is my current DMT still the right choice for me?
- What are the **benefits, risks, and alternatives**?
- What would make us change treatment?

### About symptoms
- What's the best person to help me with [fatigue / pain / bladder / cognition]?
- Could any of my symptoms be from something **other** than MS?

### About the future
- What signs should make me call sooner rather than wait?
- What would a "good year" look like for someone in my situation?

### One quietly powerful question
> "If you were me, what would you want to know that we haven't covered yet?"

Pick 2–3 to focus on. The rest can wait for next time.`,
      questions: [
        {
          prompt: "Which is an example of a useful 'shared decision' question?",
          options: JSON.stringify([
            "Can you just tell me what to do?",
            "What are the benefits, risks, and alternatives to my current DMT?",
            "Why do I have MS?",
            "Will I be cured next year?",
          ]),
          correctIndex: 1,
          explanation: "Asking about benefits, risks, and alternatives invites genuine shared decision-making about treatment.",
        },
      ],
    },
    {
      courseId: talkingToNeurologist.id,
      sortOrder: 3,
      title: "After the Appointment — What to Track",
      summary: "Capture decisions and questions while they're fresh, and turn them into a small plan.",
      durationMin: 6,
      content: `## The 24-hour debrief

The 24 hours after an appointment are when half the details slip away. A quick debrief locks them in.

### A 10-minute write-up
- **Date** and clinician
- **What was discussed** (main themes)
- **Decisions** (medication, scans, referrals)
- **What's next** (and by when)
- **Questions left over** for next time

### Track these over the next weeks

| What | Why |
|------|-----|
| Any new symptom | So you can date it accurately later |
| Side effects from changes | Helpful at your next review |
| Energy / mood patterns | Shows how treatment is landing |
| Practical wins and friction | What's working, what isn't |

### Action items, not just notes
Turn one line of your notes into a **small concrete step** within a week:
- *"Refer to physio"* → "Call GP on Monday"
- *"Try cooling vest"* → "Order, trial for 14 days"

### Closing the loop
At your next visit, open with: *"Since last time, the main changes have been…"* You'll sound — and feel — in charge of your care.`,
      questions: [
        {
          prompt: "Why is a short debrief in the day after a neurology appointment helpful?",
          options: JSON.stringify([
            "It's required by law",
            "It captures decisions and next steps while details are still fresh",
            "It replaces the need to ever see your neurologist again",
            "It guarantees no symptoms will return",
          ]),
          correctIndex: 1,
          explanation: "A quick debrief preserves decisions and action items before they fade, making follow-up much easier.",
        },
      ],
    },
    {
      courseId: mentalHealth.id,
      sortOrder: 1,
      title: "Adjustment, Grief, and Identity",
      summary: "Feelings of loss after diagnosis are normal — and they shift over time.",
      durationMin: 7,
      content: `## Adjusting to life with MS

A diagnosis often sets off a quiet kind of grief — for plans, certainty, and the version of yourself you imagined.

### What adjustment can look like
- Numbness or "this isn't really happening"
- Anger — at the body, at timing, at no one in particular
- Sadness about specific things (a hobby, a job, a pace of life)
- Bargaining — *"if I just eat perfectly…"*
- Slowly, an integration — MS becomes **part of** you, not all of you

These don't come in order, and they often loop back. That's not a setback. That's adjustment.

### Identity is bigger than diagnosis
You are still:
- The friend who remembers birthdays
- The parent / partner / colleague / artist you've always been
- A person with values, humour, and history

MS joins that list. It doesn't replace it.

### A gentle practice
Once a week, finish this sentence: *"This week, MS got [x] of me, and I got [y] of me back."*

You're not behind. You're adjusting.`,
      questions: [
        {
          prompt: "Adjustment to an MS diagnosis usually…",
          options: JSON.stringify([
            "Happens in a neat order in a few weeks",
            "Comes in waves and loops back over time, which is normal",
            "Means MS becomes your entire identity",
            "Only affects people who are already anxious",
          ]),
          correctIndex: 1,
          explanation: "Adjustment is a fluctuating process, not a linear one — and it doesn't erase the rest of who you are.",
        },
      ],
    },
    {
      courseId: mentalHealth.id,
      sortOrder: 2,
      title: "Anxiety, Mood, and MS",
      summary: "Why mood and MS are tangled, and small things that genuinely help.",
      durationMin: 8,
      content: `## Mood is part of MS care

Anxiety and low mood are **more common** in people with MS than the general population. There are reasons:
- The unpredictability of symptoms
- Inflammation itself can affect mood
- Sleep, pain, and fatigue all pull on mental health

This is not weakness. It's biology meeting circumstance.

### Signs worth noticing
- Persistent low mood for two weeks or more
- Anxiety that disrupts sleep, work, or relationships
- Losing interest in things you used to enjoy
- Feeling numb, hopeless, or "switched off"

### Small things that often help

| Lever | Why it helps |
|-------|--------------|
| **Movement** (even 10 min walks) | Mood, sleep, energy |
| **Sunlight in the morning** | Body clock, mood |
| **One social contact a day** | Lowers loneliness load |
| **Limiting doom-scrolling** | Reduces background dread |
| **Naming the feeling** | "I'm anxious" loosens its grip |

### When to seek more
Counselling, CBT, and (sometimes) medication can be genuinely life-changing. Speak to your GP, MS nurse, or a therapist — preferably one familiar with chronic illness.

You don't have to wait until things are bad to ask for support.`,
      questions: [
        {
          prompt: "If low mood has been with you most days for two weeks or more, a good next step is to…",
          options: JSON.stringify([
            "Wait it out indefinitely",
            "Mention it to your GP or MS nurse and discuss support options",
            "Assume it's unrelated to MS and ignore it",
            "Push through and hope it lifts on its own",
          ]),
          correctIndex: 1,
          explanation: "Persistent low mood deserves a conversation with your clinical team — there are effective options.",
        },
      ],
    },
    {
      courseId: mentalHealth.id,
      sortOrder: 3,
      title: "When to Reach Out for Support",
      summary: "Concrete signs that it's time to ask for help — and gentle ways to do it.",
      durationMin: 6,
      content: `## You don't have to do this alone

There is no badge for white-knuckling through a hard season. Reaching out earlier usually means recovering sooner.

### Reach out when…
- Sleep, appetite, or energy have shifted for **two weeks or more**
- Tasks that used to feel manageable now feel impossible
- You're withdrawing from people you care about
- You're using alcohol, food, or scrolling to feel less
- Hope feels thin

### Who you can talk to

| Person | Good for |
|--------|----------|
| **GP** | First port of call, referrals, prescribing |
| **MS nurse** | Linking MS and mood symptoms |
| **Therapist / counsellor** | Talking it through, building tools |
| **Trusted friend / family** | Day-to-day support |
| **MS charity helplines** | Anonymous, knowledgeable, free |

### If you're in crisis
If you're thinking about harming yourself, please contact your local emergency or crisis service straight away. You deserve immediate support.

### A small first step
Send one message today: *"Could we have a chat this week? Life's a bit heavy."*

Reaching out is not a last resort. It's how people get better.`,
      questions: [
        {
          prompt: "A good signal that it's time to reach out for support is…",
          options: JSON.stringify([
            "Feeling completely fine for months",
            "Persistent withdrawal, low mood, or hopelessness lasting two weeks or more",
            "Having one bad day",
            "Disagreeing with a friend",
          ]),
          correctIndex: 1,
          explanation: "Persistent shifts in mood, energy, or withdrawal lasting two weeks or more are a clear cue to ask for support.",
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
