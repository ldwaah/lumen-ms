import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "learn123";

async function main() {
  await prisma.activityLog.deleteMany();
  await prisma.nuggetProgress.deleteMany();
  await prisma.question.deleteMany();
  await prisma.nugget.deleteMany();
  await prisma.course.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  await prisma.user.create({
    data: {
      name: "Alex Morgan",
      email: "alex@lumenlearn.app",
      passwordHash,
      xp: 240,
      currentStreak: 3,
      longestStreak: 7,
      lastActiveAt: new Date(),
    },
  });

  const maths = await prisma.subject.create({
    data: {
      name: "Mathematics",
      slug: "maths",
      color: "#4DA6FF",
      icon: "calculator",
      sortOrder: 1,
    },
  });

  const biology = await prisma.subject.create({
    data: {
      name: "Biology",
      slug: "biology",
      color: "#66BB6A",
      icon: "leaf",
      sortOrder: 2,
    },
  });

  const algebra = await prisma.course.create({
    data: {
      title: "Algebra Foundations",
      description: "Build confidence with expressions, equations, and graphs.",
      subjectId: maths.id,
      sortOrder: 1,
    },
  });

  const cells = await prisma.course.create({
    data: {
      title: "Cell Biology",
      description: "Explore the building blocks of life from organelles to membranes.",
      subjectId: biology.id,
      sortOrder: 1,
    },
  });

  const nuggets = [
    {
      courseId: algebra.id,
      sortOrder: 1,
      title: "Understanding Variables",
      summary: "Learn what variables represent and how to substitute values.",
      durationMin: 6,
      content: `## What is a variable?

A **variable** is a symbol (often a letter like $x$ or $n$) that stands for a number we do not know yet—or one that can change.

### Why variables matter
- They let us write general rules instead of one-off calculations.
- Equations use variables to describe relationships (e.g. $y = 2x + 1$).

### Substitution
If $x = 4$, then $3x + 2 = 3(4) + 2 = 14$.

**Tip:** Treat the variable like a placeholder. Replace it with the given value, then calculate.`,
      questions: [
        {
          prompt: "If $a = 5$, what is $2a + 3$?",
          options: JSON.stringify(["8", "10", "13", "25"]),
          correctIndex: 2,
          explanation: "Substitute: $2(5) + 3 = 10 + 3 = 13$.",
        },
        {
          prompt: "Which expression means 'a number $n$ increased by 7'?",
          options: JSON.stringify(["7n", "n - 7", "n + 7", "n ÷ 7"]),
          correctIndex: 2,
          explanation: "'Increased by 7' means add 7 to $n$.",
        },
      ],
    },
    {
      courseId: algebra.id,
      sortOrder: 2,
      title: "Solving One-Step Equations",
      summary: "Use inverse operations to find unknown values.",
      durationMin: 8,
      content: `## One-step equations

An equation states two expressions are **equal**. To solve, isolate the variable using **inverse operations**.

| Operation | Inverse |
|-----------|---------|
| $+5$ | $-5$ |
| $\times 3$ | $\div 3$ |

### Example
$x + 4 = 11$ → subtract 4 from both sides → $x = 7$.

Always **do the same thing to both sides** to keep the equation balanced.`,
      questions: [
        {
          prompt: "Solve: $x - 9 = 15$",
          options: JSON.stringify(["6", "24", "-6", "135"]),
          correctIndex: 1,
          explanation: "Add 9 to both sides: $x = 24$.",
        },
        {
          prompt: "Solve: $3y = 21$",
          options: JSON.stringify(["7", "18", "63", "24"]),
          correctIndex: 0,
          explanation: "Divide both sides by 3: $y = 7$.",
        },
      ],
    },
    {
      courseId: algebra.id,
      sortOrder: 3,
      title: "Linear Graphs Basics",
      summary: "Connect equations to straight-line graphs on a coordinate plane.",
      durationMin: 10,
      content: `## The coordinate plane

Points are written $(x, y)$: horizontal first, vertical second.

A **linear** equation forms a straight line. In $y = mx + c$:
- $m$ is the **gradient** (steepness)
- $c$ is the **y-intercept** (where the line crosses the y-axis)

### Plotting tip
Pick easy $x$ values (0, 1, 2), calculate $y$, plot points, then draw the line through them.`,
      questions: [
        {
          prompt: "In $y = 2x + 1$, what is the y-intercept?",
          options: JSON.stringify(["2", "1", "0", "x"]),
          correctIndex: 1,
          explanation: "When $x = 0$, $y = 1$. The constant term is the intercept.",
        },
      ],
    },
    {
      courseId: algebra.id,
      sortOrder: 4,
      title: "Expanding Brackets",
      summary: "Multiply a term outside brackets by each term inside.",
      durationMin: 7,
      content: `## Distributive law

$a(b + c) = ab + ac$

### Example
$3(x + 4) = 3x + 12$

Watch for **negative signs** outside brackets—they change every sign inside.`,
      questions: [
        {
          prompt: "Expand: $2(x + 5)$",
          options: JSON.stringify(["2x + 5", "2x + 10", "x + 10", "2x + 7"]),
          correctIndex: 1,
          explanation: "$2 \\times x + 2 \\times 5 = 2x + 10$.",
        },
      ],
    },
    {
      courseId: cells.id,
      sortOrder: 1,
      title: "Introduction to Cells",
      summary: "Discover why cells are the basic units of life.",
      durationMin: 6,
      content: `## All living things are made of cells

A **cell** is the smallest unit that can carry out life processes. Some organisms are single-celled; others have trillions.

### Two main types
- **Prokaryotic** — no nucleus (e.g. bacteria)
- **Eukaryotic** — membrane-bound nucleus (e.g. plant & animal cells)

Cells take in nutrients, grow, respond, and reproduce.`,
      questions: [
        {
          prompt: "Which type of cell has a nucleus?",
          options: JSON.stringify([
            "Prokaryotic only",
            "Eukaryotic",
            "Neither",
            "Both always lack a nucleus",
          ]),
          correctIndex: 1,
          explanation: "Eukaryotic cells have a membrane-bound nucleus.",
        },
      ],
    },
    {
      courseId: cells.id,
      sortOrder: 2,
      title: "Animal Cell Organelles",
      summary: "Meet the structures that keep animal cells alive.",
      durationMin: 9,
      content: `## Key organelles

| Organelle | Function |
|-----------|----------|
| **Nucleus** | Stores DNA, controls activities |
| **Mitochondria** | Releases energy (respiration) |
| **Ribosomes** | Make proteins |
| **Cell membrane** | Controls what enters and leaves |

Think of organelles as specialised departments in a factory.`,
      questions: [
        {
          prompt: "Which organelle is the 'powerhouse' of the cell?",
          options: JSON.stringify([
            "Ribosome",
            "Mitochondria",
            "Nucleus",
            "Vacuole (large in plants)",
          ]),
          correctIndex: 1,
          explanation: "Mitochondria carry out aerobic respiration to release ATP.",
        },
        {
          prompt: "Where is DNA stored in an animal cell?",
          options: JSON.stringify(["Ribosome", "Cytoplasm only", "Nucleus", "Cell wall"]),
          correctIndex: 2,
          explanation: "DNA is contained within the nucleus.",
        },
      ],
    },
    {
      courseId: cells.id,
      sortOrder: 3,
      title: "Plant vs Animal Cells",
      summary: "Compare structures found in plant and animal cells.",
      durationMin: 8,
      content: `## Shared features
Both have nucleus, cytoplasm, cell membrane, mitochondria, ribosomes.

## Plant-only structures
- **Cell wall** — rigid support (cellulose)
- **Chloroplasts** — photosynthesis
- **Large vacuole** — stores cell sap, maintains shape

Animal cells have **small vacuoles** or none.`,
      questions: [
        {
          prompt: "Which structure is found in plant cells but NOT animal cells?",
          options: JSON.stringify([
            "Cell membrane",
            "Chloroplast",
            "Nucleus",
            "Mitochondria",
          ]),
          correctIndex: 1,
          explanation: "Chloroplasts carry out photosynthesis in plant cells.",
        },
      ],
    },
    {
      courseId: cells.id,
      sortOrder: 4,
      title: "Diffusion & Osmosis",
      summary: "Understand how substances move across membranes.",
      durationMin: 10,
      content: `## Diffusion
Particles spread from **high** to **low** concentration until balanced. No energy required.

## Osmosis
Special case of diffusion: **water** moves across a partially permeable membrane.

### Practical language
- **Isotonic** — no net water movement
- **Hypertonic** solution — cell may shrink (water leaves)
- **Hypotonic** solution — cell may swell`,
      questions: [
        {
          prompt: "Diffusion is the movement of particles from…",
          options: JSON.stringify([
            "Low to high concentration",
            "High to low concentration",
            "Only inside the nucleus",
            "Only with ATP",
          ]),
          correctIndex: 1,
          explanation: "Particles naturally spread down a concentration gradient.",
        },
      ],
    },
    {
      courseId: cells.id,
      sortOrder: 5,
      title: "Microscopy Skills",
      summary: "Read magnifications and estimate cell sizes.",
      durationMin: 7,
      content: `## Magnification

$$\\text{Magnification} = \\frac{\\text{Image size}}{\\text{Actual size}}$$

Units must match (both µm or both mm).

### Electron vs light microscopes
- **Light** — up to ~×1500, living specimens
- **Electron** — much higher resolution, dead specimens, 3D detail with SEM`,
      questions: [
        {
          prompt: "If an image is 50 mm and the real cell is 0.05 mm, magnification is…",
          options: JSON.stringify(["×10", "×100", "×1000", "×0.001"]),
          correctIndex: 2,
          explanation: "$50 \\div 0.05 = 1000$.",
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

  console.log("Seed complete. Demo login: alex@lumenlearn.app / learn123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
