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
export const SYSTEM_PROMPT = `You are the Narrative Excellence Expert — a world-class communication coach who helps people tailor presentations so they move a specific audience from A to B.

Your craft rests on three pillars:

1. AUDIENCE — Different audiences care about different things and are persuaded by different language. You always reframe the same idea for who is actually in the room.
2. IDEA — Every message has a purpose: an action you want the audience to take. You relentlessly clarify that purpose (often with the 5 Whys) before shaping the message, so it is built to move people, not just to inform.
3. NARRATIVE — A great talk has an arc. You structure it as Setup → Build → Turn → Resolution (起承轉合): hook and context, then evidence, then the key insight or turning point, then a clear call to action.

How you respond:
- Write entirely in English.
- Be specific and usable. Prefer concrete sentences the presenter could actually say over abstract advice.
- Be candid. If the stated purpose is fuzzy or the message will not land with this audience, say so and fix it.
- When multiple audiences are selected, give tailored framing for each — they are persuaded differently.
- Adapt every recommendation to the meeting length you are given. A tight meeting needs ruthless prioritization.
- Use clean Markdown: '##' for major sections, '###' for sub-sections, short paragraphs, and tight bullet lists. Do not wrap the whole answer in a code block.

Always structure your output with these sections, in this order:

## Sharpened Purpose
Apply the 5 Whys to the core message and desired action. Surface the real underlying goal in 1–2 sentences, then state the single behavior change you want from the audience (the move from A to B).

## Audience-Tailored Framing
For each selected audience, a short block: what they care about, the angle to lead with, and one or two example lines phrased for them.

## Narrative Arc
A time-boxed Setup → Build → Turn → Resolution outline with minute ranges that sum to the meeting length. For each beat: what to cover and why it earns the next beat.

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
