export type Persona = {
  id: string;
  name: string;
  role: string;
  emoji: string;
  /** Tailwind classes for the avatar background + ring. */
  avatar: string;
  cares: string;
  language: string;
};

/**
 * Audience archetypes are split by *what they care about* and *how they are
 * persuaded* — not by job title. That is what changes how a message should be
 * framed.
 */
export const PERSONAS: Persona[] = [
  {
    id: "decision-makers",
    name: "Decision Makers",
    role: "VPs / Directors",
    emoji: "🧭",
    avatar: "bg-[#141413] text-white",
    cares: "ROI, risk, trade-offs, and time. They are accountable for the call.",
    language:
      "Lead with the conclusion and the business impact. Quantify cost, risk, and upside. Make the decision and its trade-offs explicit.",
  },
  {
    id: "leaders",
    name: "Leaders / Execs",
    role: "C-level",
    emoji: "📊",
    avatar: "bg-accent text-white",
    cares: "Strategy, vision, market position, and long-term value.",
    language:
      "Stay at the big-picture altitude. Be concise. Connect the idea to strategy and the company's direction, not implementation detail.",
  },
  {
    id: "product-eng",
    name: "Product & Eng",
    role: "Builders",
    emoji: "⚙️",
    avatar: "bg-[#2d4a43] text-white",
    cares: "Feasibility, scope, technical detail, and how it actually works.",
    language:
      "Be precise and logical. Show the mechanism, the constraints, and the scope. Respect their need for rigor over hand-waving.",
  },
  {
    id: "design",
    name: "Design Team",
    role: "Craft & UX",
    emoji: "🎨",
    avatar: "bg-[#3a5a8c] text-white",
    cares: "User experience, craft, consistency, and the human story.",
    language:
      "Tell it through the user's journey. Use narrative and concrete scenarios. Honor craft and the experience over raw metrics.",
  },
  {
    id: "stakeholders",
    name: "Cross-functional",
    role: "Stakeholders",
    emoji: "🤝",
    avatar: "bg-[#6b5b3e] text-white",
    cares: "Impact on their team, dependencies, and what's in it for them.",
    language:
      "Frame around collaboration and alignment. Spell out dependencies and the specific 'what's in it for me' for each group.",
  },
];

export const personaById = (id: string) => PERSONAS.find((p) => p.id === id);
