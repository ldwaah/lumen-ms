export type SafetyResult =
  | { type: "ok" }
  | { type: "crisis"; message: string }
  | { type: "emergency"; message: string }
  | { type: "medication"; message: string };

const CRISIS_PATTERNS = [
  /\b(suicid|kill myself|end my life|want to die|self[- ]?harm|hurt myself)\b/i,
  /\b(no reason to (live|go on))\b/i,
];

const EMERGENCY_PATTERNS = [
  /\b(sudden (vision|blind)|can't see|loss of vision)\b/i,
  /\b(loss of bladder|can't urinate|retention)\b/i,
  /\b(severe (weakness|numbness)|paralys|paralyz)\b/i,
  /\b(worst headache|thunderclap)\b/i,
  /\b(difficulty breathing|can't breathe)\b/i,
  /\b(seizure|convulsion)\b/i,
];

const DMT_NAMES =
  "ocrevus|ocrelizumab|kesimpta|ofatumumab|tysabri|natalizumab|aubagio|teriflunomide|tecfidera|vumerity|dimethyl fumarate|copaxone|glatiramer|rituxan|rituximab|lemtrada|alemtuzumab|mavenclad|cladribine|gilenya|fingolimod|mayzent|siponimod|zeposia|ozanimod|ponvory|ponesimod|briumvi|ublituximab|avonex|rebif|betaseron|plegridy|interferon";

const MEDICATION_PATTERNS = [
  /\b(should i (stop|start|change|switch)|increase|decrease).*(medication|dmt|drug|dose)\b/i,
  /\b(stop taking|skip my|missed.*dose)\b/i,
  new RegExp(`\\b(alternative to|replace).*(${DMT_NAMES})\\b`, "i"),
  new RegExp(`\\b(stop|start|change|switch|pause|skip|quit).{0,20}(${DMT_NAMES})\\b`, "i"),
  new RegExp(`\\b(${DMT_NAMES}).{0,20}(stop|start|change|switch|pause|skip|quit)\\b`, "i"),
];

export const CRISIS_RESOURCES = `If you are in crisis, please reach out now:
• UK: Samaritans — 116 123 (free, 24/7)
• US: 988 Suicide & Crisis Lifeline — call or text 988
• Emergency: call 999 (UK) or 911 (US)

You are not alone. Lumen cannot provide emergency mental health care.`;

export const EMERGENCY_MESSAGE = `Some symptoms you've described may need urgent medical attention. Please contact your MS team or go to A&E / ER if symptoms are new, severe, or rapidly worsening.

Lumen is not a substitute for medical care.`;

export const MEDICATION_MESSAGE = `I can't recommend changing, starting, or stopping any medication — that's a decision for you and your neurologist.

I can help you:
• Draft questions to ask at your next appointment
• Understand general information about MS treatments
• Track how you're feeling day to day`;

export function checkMessageSafety(text: string): SafetyResult {
  if (CRISIS_PATTERNS.some((p) => p.test(text))) {
    return { type: "crisis", message: CRISIS_RESOURCES };
  }
  if (EMERGENCY_PATTERNS.some((p) => p.test(text))) {
    return { type: "emergency", message: EMERGENCY_MESSAGE };
  }
  if (MEDICATION_PATTERNS.some((p) => p.test(text))) {
    return { type: "medication", message: MEDICATION_MESSAGE };
  }
  return { type: "ok" };
}
