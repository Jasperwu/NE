/**
 * Curated "gold standard" narrative frameworks for the Framework Library.
 *
 * These are hand-written exemplars — the whole point is that they are reliably
 * excellent, so they are static (not AI-generated). Each framework pairs a
 * skeleton (the structure) with a fully worked example and per-step annotations
 * that make the "moves" of a great narrative visible.
 *
 * This file is standalone data — it is not imported by the existing tool flow.
 */

export type FrameworkStep = {
  /** The beat name, e.g. "Problem". */
  label: string;
  /** What this beat is for, in one line. */
  purpose: string;
  /** A model sentence the presenter could actually say. */
  example: string;
  /** Why this line works — the teachable move. */
  annotation: string;
};

export type Framework = {
  id: string;
  name: string;
  abbrev: string;
  /** One-line summary of the shape. */
  tagline: string;
  /** Goal ids (see lib/goals.ts) this framework fits best. */
  bestForGoals: string[];
  /** Human-readable "use this when…". */
  whenToUse: string;
  /** The worked example's scenario, for context. */
  scenario: string;
  steps: FrameworkStep[];
  /** The signals that separate an A+ version from a mediocre one. */
  tells: string[];
};

export const FRAMEWORKS: Framework[] = [
  {
    id: "pira",
    name: "Problem → Insight → Recommendation → Ask",
    abbrev: "PIRA",
    tagline: "Drive a clear decision or secure buy-in.",
    bestForGoals: ["make-decision", "next-actions", "secure-resources"],
    whenToUse:
      "You need a specific yes/no or a commitment of resources in the room.",
    scenario:
      "A 30-minute meeting with VPs proposing to pause new features for a reliability sprint.",
    steps: [
      {
        label: "Problem",
        purpose: "Open with a quantified, business-framed problem.",
        example:
          "Last quarter our p90 latency rose 40%, and three enterprise accounts named reliability in their renewal calls.",
        annotation:
          "Leads with numbers and business impact — not “engineering wants to refactor.” The room feels the cost immediately.",
      },
      {
        label: "Insight",
        purpose: "One sharp insight that reframes the cause.",
        example:
          "This isn’t a scaling problem — it’s four releases of deferred shortcuts piling up in the checkout path.",
        annotation:
          "A single non-obvious insight earns the recommendation. One insight, not five — more would dilute it.",
      },
      {
        label: "Recommendation",
        purpose: "A single, scoped recommendation.",
        example:
          "Pause net-new features for six weeks and run a focused reliability sprint on checkout.",
        annotation:
          "Specific and bounded — easy to say yes to. A vague “invest more in quality” gets nodded at and ignored.",
      },
      {
        label: "Ask",
        purpose: "Name the exact decision.",
        example:
          "I’m asking to reassign two engineers for six weeks, targeting p90 under 300ms. Decision today: yes or no?",
        annotation:
          "States the owner, metric, timebox, and the decision itself. No one can leave with “interesting, let’s circle back.”",
      },
    ],
    tells: [
      "Opens with quantified, business-framed stakes — not internal jargon.",
      "Exactly one insight, not a list.",
      "One scoped recommendation, not a menu.",
      "The ask names a single decision with owner, metric, and deadline.",
    ],
  },
  {
    id: "scr",
    name: "Situation → Complication → Resolution",
    abbrev: "SCR",
    tagline: "Win agreement on a strategic direction.",
    bestForGoals: ["convince-strategy", "feature-alignment"],
    whenToUse:
      "You’re persuading on a direction or strategic bet, and need the room to feel the status quo is untenable.",
    scenario: "Convincing leadership to deliberately move the product upmarket.",
    steps: [
      {
        label: "Situation",
        purpose: "Start with a truth everyone already shares.",
        example:
          "We’ve grown 30% a year by serving mid-market teams really well.",
        annotation:
          "Opening with shared agreement lowers defenses — the room nods before you introduce tension.",
      },
      {
        label: "Complication",
        purpose: "Introduce the tension that breaks the status quo.",
        example:
          "But mid-market is saturating — almost all of last half’s new-logo growth came from enterprise deals we weren’t built to serve.",
        annotation:
          "The complication makes “do nothing” feel risky. This is the engine of the whole talk.",
      },
      {
        label: "Resolution",
        purpose: "A path that directly answers the tension.",
        example:
          "So we make a deliberate move upmarket this half: SSO, audit logs, and a named-account sales motion.",
        annotation:
          "The resolution resolves the exact tension you just raised — not a generic wish list.",
      },
    ],
    tells: [
      "Agreement first, tension second — never lead with the problem cold.",
      "The complication is specific and uncomfortable, not hand-wavy.",
      "The resolution maps 1:1 to the complication.",
      "One strategic move, not a portfolio of initiatives.",
    ],
  },
  {
    id: "wsn",
    name: "What → So-What → Now-What",
    abbrev: "WSN",
    tagline: "Align a cross-functional group and trigger action.",
    bestForGoals: ["feature-alignment", "build-awareness", "gather-feedback"],
    whenToUse:
      "You’re sharing results or status and need shared understanding plus clear next steps.",
    scenario: "A cross-functional update on an onboarding redesign A/B test.",
    steps: [
      {
        label: "What",
        purpose: "Just the facts, briefly.",
        example:
          "We ran the onboarding redesign test for three weeks across 40,000 users.",
        annotation:
          "No spin, no interpretation yet — establish a shared factual base everyone trusts.",
      },
      {
        label: "So-What",
        purpose: "Translate facts into meaning — including the bad news.",
        example:
          "Activation rose 12% in the variant, but support tickets about step 3 doubled.",
        annotation:
          "Naming the inconvenient signal builds credibility and pre-empts the question someone was about to ask.",
      },
      {
        label: "Now-What",
        purpose: "Concrete next actions with owners and dates.",
        example:
          "We ship the variant next sprint; Maya’s team fixes step 3 before GA, by the 14th.",
        annotation:
          "Every action has an owner and a date — the meeting ends with motion, not a vague “let’s monitor it.”",
      },
    ],
    tells: [
      "Facts are separated from interpretation.",
      "The “so-what” includes the inconvenient finding, not just the win.",
      "Every “now-what” has a named owner and a date.",
      "Short — this format earns trust by being tight.",
    ],
  },
  {
    id: "story-arc",
    name: "Hook → Tension → Turn → Vision",
    abbrev: "Story Arc",
    tagline: "Inspire and rally a team around a mission.",
    bestForGoals: ["inspire", "build-awareness"],
    whenToUse:
      "You’re motivating people — a kickoff, an all-hands, a rallying moment.",
    scenario: "A quarter kickoff rallying the team around rebuilding onboarding.",
    steps: [
      {
        label: "Hook",
        purpose: "Open on a concrete, human moment.",
        example:
          "Last year a user emailed us: “Yours is the only app my dad can actually use.”",
        annotation:
          "A specific human moment beats a mission statement — it makes the stakes felt, not stated.",
      },
      {
        label: "Tension",
        purpose: "Name the gap between the promise and reality.",
        example:
          "But today, 60% of new users like him drop off before they ever feel that.",
        annotation:
          "The honest gap creates the emotional need for change — and earns the team’s attention.",
      },
      {
        label: "Turn",
        purpose: "The decision that closes the gap.",
        example:
          "This quarter we’re rebuilding onboarding around clarity, not features.",
        annotation:
          "One clear turning point. The team now knows exactly what changes.",
      },
      {
        label: "Vision",
        purpose: "Paint the after-state vividly.",
        example:
          "Imagine every new user hitting that “finally, something built for me” moment in their first five minutes.",
        annotation:
          "A vivid, specific picture of success — not a platitude. People work toward images they can see.",
      },
    ],
    tells: [
      "Opens with a concrete human moment, not a mission statement.",
      "The tension is honest about the current gap.",
      "Exactly one turning point.",
      "The vision is vivid and specific — you can picture it.",
    ],
  },
];

export const frameworkById = (id: string) =>
  FRAMEWORKS.find((f) => f.id === id);
