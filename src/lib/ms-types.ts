export const MS_TYPES = [
  "RRMS",
  "SPMS",
  "PPMS",
  "CIS",
  "Unsure",
] as const;

export type MSType = (typeof MS_TYPES)[number];

export const SYMPTOM_TYPES = [
  "Fatigue",
  "Numbness / tingling",
  "Vision changes",
  "Weakness",
  "Balance issues",
  "Spasticity",
  "Pain",
  "Cognitive fog",
  "Bladder / bowel",
  "Other",
] as const;

export const MEDICATION_TYPES = ["DMT", "symptomatic", "supplement"] as const;

export const GOAL_SUGGESTIONS = [
  "Build a sustainable daily routine",
  "Manage fatigue better",
  "Prepare for my next neurology appointment",
  "Stay active within my limits",
  "Improve sleep quality",
  "Reduce stress and anxiety",
] as const;

export const COACH_QUICK_PROMPTS = [
  "How can I pace myself today?",
  "Help me prepare questions for my neurologist",
  "I'm having a tough day — what can help?",
  "Explain fatigue pacing in simple terms",
] as const;
