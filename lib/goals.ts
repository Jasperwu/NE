export type Goal = {
  id: string;
  label: string;
  emoji: string;
  description: string;
};

/**
 * Goals describe the *action* you want to move the audience toward — the "B"
 * in moving an audience from A to B.
 */
export const GOALS: Goal[] = [
  {
    id: "next-actions",
    label: "Drive next actions",
    emoji: "✅",
    description: "Get the audience to commit to a concrete next step.",
  },
  {
    id: "make-decision",
    label: "Make a decision",
    emoji: "⚖️",
    description: "Get a yes/no or a pick-one verdict in the room.",
  },
  {
    id: "convince-strategy",
    label: "Convince on strategy",
    emoji: "🎯",
    description: "Win agreement on a direction or strategic bet.",
  },
  {
    id: "feature-alignment",
    label: "Feature / roadmap alignment",
    emoji: "🧩",
    description: "Get teams aligned on scope, priorities, or sequencing.",
  },
  {
    id: "secure-resources",
    label: "Get buy-in & resources",
    emoji: "💰",
    description: "Secure budget, headcount, or executive sponsorship.",
  },
  {
    id: "build-awareness",
    label: "Build awareness",
    emoji: "💡",
    description: "Educate the audience on the situation or the problem.",
  },
  {
    id: "gather-feedback",
    label: "Gather feedback",
    emoji: "🔁",
    description: "Open a direction up for input before committing.",
  },
  {
    id: "inspire",
    label: "Inspire & motivate",
    emoji: "🔥",
    description: "Energize a team around a mission or a moment.",
  },
];

export const goalById = (id: string) => GOALS.find((g) => g.id === id);
