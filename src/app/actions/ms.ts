"use server";

import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { startOfDay } from "date-fns";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveOnboarding(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;
  const msType = String(formData.get("msType") ?? "Unsure");
  const diagnosisDateStr = formData.get("diagnosisDate") as string | null;
  const currentDMT = (formData.get("currentDMT") as string) || null;
  const goalsRaw = formData.getAll("goals") as string[];
  const largeText = formData.get("largeText") === "on";
  const highContrast = formData.get("highContrast") === "on";
  const lowEnergyMode = formData.get("lowEnergyMode") === "on";
  const aiConsent = formData.get("aiConsent") === "on";

  await prisma.mSProfile.upsert({
    where: { userId },
    create: {
      userId,
      msType,
      diagnosisDate: diagnosisDateStr ? new Date(diagnosisDateStr) : null,
      currentDMT,
      goals: JSON.stringify(goalsRaw),
      largeText,
      highContrast,
      lowEnergyMode,
      onboardingDone: true,
      consentFlags: JSON.stringify({ ai_coach: aiConsent }),
    },
    update: {
      msType,
      diagnosisDate: diagnosisDateStr ? new Date(diagnosisDateStr) : null,
      currentDMT,
      goals: JSON.stringify(goalsRaw),
      largeText,
      highContrast,
      lowEnergyMode,
      onboardingDone: true,
      consentFlags: JSON.stringify({ ai_coach: aiConsent }),
    },
  });

  if (aiConsent) {
    await prisma.consentRecord.create({
      data: { userId, feature: "ai_coach", granted: true },
    });
  }

  for (const title of goalsRaw) {
    const existing = await prisma.goal.findFirst({
      where: { userId, title },
    });
    if (!existing) {
      await prisma.goal.create({ data: { userId, title } });
    }
  }

  revalidatePath("/today");
  redirect("/today");
}

export async function saveDailyCheckIn(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;
  const today = startOfDay(new Date());

  await prisma.dailyCheckIn.upsert({
    where: { userId_date: { userId, date: today } },
    create: {
      userId,
      date: today,
      energy: Number(formData.get("energy")),
      mood: Number(formData.get("mood")),
      pain: Number(formData.get("pain")),
      brainFog: Number(formData.get("brainFog")),
      sleepHours: formData.get("sleepHours")
        ? Number(formData.get("sleepHours"))
        : null,
      stress: formData.get("stress") ? Number(formData.get("stress")) : null,
      notes: (formData.get("notes") as string) || null,
    },
    update: {
      energy: Number(formData.get("energy")),
      mood: Number(formData.get("mood")),
      pain: Number(formData.get("pain")),
      brainFog: Number(formData.get("brainFog")),
      sleepHours: formData.get("sleepHours")
        ? Number(formData.get("sleepHours"))
        : null,
      stress: formData.get("stress") ? Number(formData.get("stress")) : null,
      notes: (formData.get("notes") as string) || null,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { lastActiveAt: new Date() },
  });

  revalidatePath("/today");
  revalidatePath("/track");
}

export async function logSymptom(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.symptomEvent.create({
    data: {
      userId: session.user.id,
      type: String(formData.get("type")),
      severity: Number(formData.get("severity")),
      startedAt: new Date(String(formData.get("startedAt"))),
      notes: (formData.get("notes") as string) || null,
    },
  });

  revalidatePath("/track");
}

export async function logMedication(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;
  const medId = formData.get("medicationId") as string | null;

  if (medId) {
    await prisma.medicationLog.create({
      data: { medicationId: medId, takenAt: new Date() },
    });
  } else {
    const med = await prisma.medication.create({
      data: {
        userId,
        name: String(formData.get("name")),
        type: String(formData.get("type")),
        dose: (formData.get("dose") as string) || null,
        schedule: (formData.get("schedule") as string) || null,
      },
    });
    await prisma.medicationLog.create({
      data: { medicationId: med.id, takenAt: new Date() },
    });
  }

  revalidatePath("/track");
}

export async function logRelapse(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const symptoms = formData.getAll("symptoms") as string[];

  await prisma.relapseEvent.create({
    data: {
      userId: session.user.id,
      startedAt: new Date(String(formData.get("startedAt"))),
      symptoms: JSON.stringify(symptoms),
      severity: Number(formData.get("severity")),
      treatedWithSteroids: formData.get("treatedWithSteroids") === "on",
      clinicianNotes: (formData.get("clinicianNotes") as string) || null,
    },
  });

  revalidatePath("/track");
}

export async function updateMSProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  await prisma.mSProfile.upsert({
    where: { userId },
    create: { userId },
    update: {
      msType: String(formData.get("msType") ?? "Unsure"),
      currentDMT: (formData.get("currentDMT") as string) || null,
      lowEnergyMode: formData.get("lowEnergyMode") === "on",
      largeText: formData.get("largeText") === "on",
      highContrast: formData.get("highContrast") === "on",
    },
  });

  revalidatePath("/profile");
  revalidatePath("/today");
}

export async function addCareTeamMember(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.careTeamMember.create({
    data: {
      userId: session.user.id,
      name: String(formData.get("name")),
      role: String(formData.get("role")),
      email: (formData.get("email") as string) || null,
      permissions: String(formData.get("permissions") ?? "view_summary"),
    },
  });

  revalidatePath("/care-team");
}

export async function clearChatHistory() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.chatThread.deleteMany({ where: { userId: session.user.id } });
  revalidatePath("/coach");
}

export async function deleteMyAccount() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  // GDPR audit: record the deletion request before the cascade removes it.
  // The schema cascades ConsentRecord on User delete, so this row is wiped
  // alongside the user. Accepting that loss for simplicity (option a).
  // TODO: when an immutable audit table exists, mirror this event there so
  // the deletion is provably logged after the user is gone (option b).
  await prisma.consentRecord.create({
    data: { userId, feature: "account_deletion", granted: true },
  });

  // Prisma cascade handles every child row (onDelete: Cascade on all relations).
  await prisma.user.delete({ where: { id: userId } });

  await signOut({ redirectTo: "/login" });
}
