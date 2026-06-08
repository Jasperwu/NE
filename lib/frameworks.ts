/**
 * Curated "gold standard" narrative frameworks for the Framework Library.
 *
 * These are hand-written exemplars — the whole point is that they are reliably
 * excellent, so they are static (not AI-generated). Each framework pairs a
 * skeleton (the structure) with a fully worked example, per-step annotations
 * that make the "moves" of a great narrative visible, a note on how to tailor
 * the same content to different audiences, and diagnostic "tells" the user can
 * self-grade against.
 *
 * Content reviewed against a narrative-expert quality bar (Minto Pyramid / SCQA,
 * Duarte, TED). Examples are intentionally spread across domains (SaaS,
 * healthcare, consumer, finance) so the patterns read as universal.
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
  /** Why this line works — the teachable move (names the failure mode it avoids). */
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
  /** How to re-pitch the same content for a different audience. */
  tailoring: string;
  /** Diagnostic self-checks that separate an A+ version from a mediocre one. */
  tells: string[];
};

export const FRAMEWORKS: Framework[] = [
  {
    id: "pira",
    name: "Problem → Insight → Recommendation → Ask",
    abbrev: "PIRA",
    tagline: "Build the case, then drive a clear decision.",
    bestForGoals: ["make-decision", "next-actions", "secure-resources"],
    whenToUse:
      "You need a specific yes/no or a commitment of resources, and the room needs to feel the problem before they’ll back the fix.",
    scenario:
      "A 30-minute meeting with VPs proposing to pause new features for a reliability sprint.",
    steps: [
      {
        label: "Problem",
        purpose: "Open with a quantified, business-framed problem.",
        example:
          "Last quarter our p90 latency rose 40%, and three enterprise accounts named reliability in their renewal calls.",
        annotation:
          "Leads with numbers and business impact — not “engineering wants to refactor.” The room feels the cost before they hear the fix.",
      },
      {
        label: "Insight",
        purpose: "One sharp insight that reframes the cause.",
        example:
          "This isn’t a scaling problem — it’s four releases of deferred shortcuts piling up in the checkout path.",
        annotation:
          "A single non-obvious insight earns the recommendation. List five and you have none — the room can’t tell which one matters.",
      },
      {
        label: "Recommendation",
        purpose: "A single, scoped recommendation.",
        example:
          "Pause net-new features for six weeks and run a focused reliability sprint on checkout.",
        annotation:
          "Scope is the persuasion: “six weeks” and “checkout only” pre-empt the VP’s real fear — that a reliability push becomes an open-ended feature freeze.",
      },
      {
        label: "Ask",
        purpose: "Name the exact decision.",
        example:
          "I’m asking to reassign two engineers for six weeks, targeting p90 under 300ms. Decision today: yes or no?",
        annotation:
          "A VP can’t act on “we should invest in reliability.” Give them the exact motion to approve — two engineers, six weeks — so the only thing left to do is say yes.",
      },
    ],
    tailoring:
      "For a CFO, lead the Ask with cost-of-delay (“every week is one more at-risk renewal”). For the eng team, lead with the on-call pain they live with.",
    tells: [
      "Could a stranger repeat your ask in one sentence? If not, it isn’t scoped.",
      "The opening line is a number and its business impact — not internal jargon.",
      "There is exactly one insight, not a list.",
      "The ask names a single decision with owner, metric, and deadline.",
    ],
  },
  {
    id: "bluf",
    name: "Bottom Line Up Front (Answer-First)",
    abbrev: "BLUF",
    tagline: "Lead with the answer — for busy execs and short slots.",
    bestForGoals: ["make-decision", "secure-resources", "build-awareness"],
    whenToUse:
      "Time is short, the audience is senior, or it’s a written update — they want the recommendation first and the support second.",
    scenario:
      "A 5-minute slot in a leadership review to get sign-off on switching payments vendors.",
    steps: [
      {
        label: "Bottom line",
        purpose: "Lead with the recommendation and its headline number.",
        example:
          "I recommend we switch our payments processor to Acme by Q3 — it cuts fees about $400K a year with a two-week migration.",
        annotation:
          "The decision is in sentence one. Everything after is support a busy exec can opt into — not wade through to find the point. Burying the lede is the #1 executive-comms mistake.",
      },
      {
        label: "The reasons (grouped)",
        purpose: "Two to four grouped, non-overlapping reasons.",
        example:
          "Three reasons: it’s 0.4% cheaper per transaction, it ships the fraud tooling we keep hand-building, and our current contract renews in Q3 anyway.",
        annotation:
          "Group into a few buckets the listener can hold — not a flat list of nine. Overlapping reasons read as one weak reason repeated.",
      },
      {
        label: "The ask / next step",
        purpose: "A single decision tied to a real deadline.",
        example:
          "I need a go/no-go today — we have to give 60 days’ notice before the renewal locks us in for another year.",
        annotation:
          "The deadline is real, not manufactured. Urgency you invent gets discounted; urgency that already exists moves people.",
      },
    ],
    tailoring:
      "For the CFO, lead with the savings; for the CTO, lead with the fraud tooling and migration risk — same recommendation, support reordered for what each one weighs.",
    tells: [
      "Your first sentence contains both the recommendation and the headline metric.",
      "Reasons are grouped into a few buckets and don’t overlap.",
      "A stranger could repeat your bottom line verbatim after one listen.",
      "The ask has a real deadline, not an invented one.",
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
          "Start on a fact they’d state themselves. If they’re nodding at sentence one, they can’t dismiss the complication as your agenda.",
      },
      {
        label: "Complication",
        purpose: "Introduce the tension that breaks the status quo.",
        example:
          "But mid-market is saturating — almost all of last half’s new-logo growth came from enterprise deals we weren’t built to serve.",
        annotation:
          "The complication makes “do nothing” feel risky. Name the number that creates the tension — this is the engine of the whole talk.",
      },
      {
        label: "Resolution",
        purpose: "A path that directly answers the tension.",
        example:
          "So we make a deliberate move upmarket this half: SSO, audit logs, and a named-account sales motion.",
        annotation:
          "It answers only the complication you raised — upmarket, not “upmarket plus new pricing plus partnerships.” A resolution that solves more than the problem reads as a wish list.",
      },
    ],
    tailoring:
      "For the board, frame the complication as market risk; for the sales team, frame it as the enterprise deals they’re already losing.",
    tells: [
      "You open on a fact the room would state themselves.",
      "The complication is specific and uncomfortable — it names the number that makes “do nothing” risky.",
      "The resolution maps 1:1 to the complication and solves nothing more.",
      "It’s one strategic move, not a portfolio of initiatives.",
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
    scenario:
      "A cross-functional review of a new digital patient check-in piloted at two clinics.",
    steps: [
      {
        label: "What",
        purpose: "Just the facts, briefly.",
        example:
          "We piloted digital check-in at two clinics for a month — about 3,000 patient visits.",
        annotation:
          "Resist editorializing here. If interpretation leaks into the facts, the room argues about your conclusion before they’ve agreed on what happened.",
      },
      {
        label: "So-What",
        purpose: "Translate facts into meaning — including the bad news.",
        example:
          "Average check-in dropped from 11 to 6 minutes — but front-desk staff flagged that elderly patients without smartphones got stuck.",
        annotation:
          "Naming the inconvenient signal builds credibility and pre-empts the exact question someone in the room was about to ask.",
      },
      {
        label: "Now-What",
        purpose: "Concrete next actions with owners and dates.",
        example:
          "We roll out to all clinics next month; Priya’s team adds a staff-assisted kiosk for patients without phones, ready before the 30th.",
        annotation:
          "An action without an owner is a hope. Naming Priya and the 30th turns a status update into a commitment the room can hold someone to.",
      },
    ],
    tailoring:
      "For clinicians, lead the So-What with patient experience; for the COO, lead with throughput and cost per visit.",
    tells: [
      "Facts and interpretation are separated — no spin in the “What.”",
      "The “So-What” tells on yourself — it includes the inconvenient finding.",
      "Every “Now-What” has a named owner and a date.",
      "It’s short — this format earns trust by being tight.",
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
          "The gap has to be your fault, not the market’s. “60% like him drop off” indicts the team — which is what licenses the team to fix it.",
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
          "Picture next quarter: someone like him signs up on Sunday and is sending money to his grandkid before his coffee gets cold — no support call, no son walking him through it.",
        annotation:
          "A vivid, specific picture that escalates the hook instead of repeating it. People work toward images they can actually see.",
      },
    ],
    tailoring:
      "For the team, frame the Vision as work they’ll be proud of; for leadership, tie the same vision to retention and growth.",
    tells: [
      "It opens with one concrete human moment — not a mission statement.",
      "The tension indicts the team, not the market.",
      "There is exactly one turning point.",
      "The vision is vivid enough to picture — and escalates the hook rather than repeating it.",
    ],
  },
];

export const frameworkById = (id: string) =>
  FRAMEWORKS.find((f) => f.id === id);
