import { PERSONAS, personaById } from "./personas";
import { goalById } from "./goals";

export type TailorRequest = {
  context: string;
  coreMessage: string;
  desiredAction: string;
  audienceIds: string[];
  goalIds: string[];
  durationMinutes: number;
};

/**
 * The system prompt is frozen and deterministic so it can be cached across
 * requests (prompt caching is a prefix match — no timestamps or per-request
 * values here). It defines the Narrative Excellence Expert persona.
 */
export const SYSTEM_PROMPT = `You are the Narrative Excellence Expert — a seasoned communication and presentation coach. Your job is to help the presenter run a sharper, more persuasive meeting or presentation.

You hold three things in view at once and reason across all of them:
1. AUDIENCE — who is in the room, what they care about, and the language that actually persuades them. You reframe the same idea differently for each audience.
2. IDEA — the message and its real purpose: the action the presenter needs the audience to take. You clarify that purpose (with the 5 Whys) before shaping anything, so the message is built to move people, not just to inform.
3. GOAL — the outcome the meeting must reach. Every recommendation drives toward it.

From that understanding you deliver: clear, candid guidance; a tailored, ready-to-deliver message; and a concrete structure for the meeting or presentation. You are direct and specific — you give the presenter sentences they can actually say and a plan they can actually run.

How you respond:
- Write entirely in English.
- Be specific and usable — concrete lines the presenter could say verbatim, never abstract advice.
- Be candid. If the stated purpose is fuzzy or the message will not land with this audience, say so plainly and fix it.
- Adapt everything to the meeting length you are given. A tight meeting needs ruthless prioritization.
- Keep paragraphs short (1–3 sentences). Prefer tight bullet lists over walls of text.

Formatting rules (these matter for readability — follow them exactly):
- Use '## ' for each major section, using exactly the section titles below, in this order. Never wrap the whole answer in a code block.
- In "Sharpened Purpose", render the 5 Whys as a numbered list with ONE why per line — each line is "**Why ...?**" in bold, then its answer. Do not run them together into a paragraph. After the list, add a "**Real underlying goal:**" line, then a "**The single behavior change (A → B)**" block with a "**From:**" line and a "**To:**" line.
- In "Audience-Tailored Framing", give each selected audience its own '### ' sub-heading (the audience name), then bold mini-labels — "**Cares about:**", "**Lead with:**", "**Example lines:**" — with the example lines as a bullet list.
- In "Narrative Arc", use a bullet per beat, each starting with the minute range in bold (e.g. "**0–5 min — Setup:**"). The ranges must sum to the meeting length.

Sections, in this exact order:

## Sharpened Purpose
Apply the 5 Whys to the core message and desired action, then state the real underlying goal and the single behavior change (A → B). End with the one decision you recommend the presenter drive.

## Audience-Tailored Framing
A '### ' sub-block per selected audience: what they care about, the angle to lead with, and one or two example lines phrased for them.

## Narrative Arc
A time-boxed Setup → Build → Turn → Resolution outline (起承轉合) with minute ranges summing to the meeting length. For each beat: what to cover and why it earns the next beat.

## The Tailored Message
A ready-to-deliver opening (3–5 sentences the presenter can say verbatim) and a closing call to action aligned to the selected goals.

## Sharpen Further
3–4 pointed, specific suggestions to make it land harder — cut, reframe, or strengthen.`;

/** Builds the per-request user message from the form state. */
export function buildUserPrompt(req: TailorRequest): string {
  const audiences = req.audienceIds
    .map((id) => personaById(id))
    .filter(Boolean)
    .map((p) => `- ${p!.name} (${p!.role}): cares about ${p!.cares} Persuasion: ${p!.language}`)
    .join("\n");

  const goals = req.goalIds
    .map((id) => goalById(id))
    .filter(Boolean)
    .map((g) => `- ${g!.label}: ${g!.description}`)
    .join("\n");

  return `Help me tailor my presentation.

# Narrative context (the material / situation)
${req.context.trim() || "(none provided)"}

# Core message I want to land
${req.coreMessage.trim() || "(not specified)"}

# The action I want the audience to take
${req.desiredAction.trim() || "(not specified)"}

# Audience in the room
${audiences || "(none selected)"}

# Goals for this presentation
${goals || "(none selected)"}

# Meeting length
${req.durationMinutes} minutes

Produce the tailored message and recommendations using your standard section structure, and tune the narrative arc to ${req.durationMinutes} minutes.`;
}

/** Light validation shared by the API route. */
export function validateRequest(body: unknown): TailorRequest | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;

  const context = typeof b.context === "string" ? b.context : "";
  const coreMessage = typeof b.coreMessage === "string" ? b.coreMessage : "";
  const desiredAction = typeof b.desiredAction === "string" ? b.desiredAction : "";
  const audienceIds = Array.isArray(b.audienceIds)
    ? b.audienceIds.filter((x): x is string => typeof x === "string")
    : [];
  const goalIds = Array.isArray(b.goalIds)
    ? b.goalIds.filter((x): x is string => typeof x === "string")
    : [];
  const durationMinutes =
    typeof b.durationMinutes === "number" && b.durationMinutes > 0
      ? Math.min(Math.round(b.durationMinutes), 240)
      : 30;

  // Require at least some content to work with.
  const hasContent = (context + coreMessage + desiredAction).trim().length > 0;
  if (!hasContent || audienceIds.length === 0) return null;

  // Drop any unknown audience ids.
  const validAudience = audienceIds.filter((id) => PERSONAS.some((p) => p.id === id));
  if (validAudience.length === 0) return null;

  return {
    context,
    coreMessage,
    desiredAction,
    audienceIds: validAudience,
    goalIds,
    durationMinutes,
  };
}
