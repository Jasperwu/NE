/**
 * Hand-drawn, sketch-style line illustrations for each audience persona.
 * Monochrome (uses currentColor), slightly loose strokes to read as a sketch
 * rather than a flat icon. One illustration per persona id.
 */

type Props = { id: string; className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
      {children}
    </svg>
  );
}

/** Decision Makers — a balance/scale: weighing trade-offs and the call. */
function DecisionMakers() {
  return (
    <Frame>
      <path {...stroke} d="M24 9.5c1 0 1 2 0 2s-1-2 0-2Z" />
      <path {...stroke} d="M24 11.5V35" />
      <path {...stroke} d="M13 35h22" />
      <path {...stroke} d="M24 14 11 19m13-5 13 5" />
      <path {...stroke} d="M11 19c-2.4 4.6-2.4 5.4 0 6 2.4-.6 2.4-1.4 0-6Z" />
      <path {...stroke} d="M37 19c-2.4 4.6-2.4 5.4 0 6 2.4-.6 2.4-1.4 0-6Z" />
    </Frame>
  );
}

/** Leaders / Execs — rising bars with a trend arrow: strategy & growth. */
function Leaders() {
  return (
    <Frame>
      <path {...stroke} d="M10 38h28" />
      <path {...stroke} d="M14 38V30m7 8V25m7 13V20" />
      <path {...stroke} d="M13 18l7-6 5 4 9-9" />
      <path {...stroke} d="M30 7h5v5" />
    </Frame>
  );
}

/** Product & Eng — a gear: how it actually works. */
function ProductEng() {
  return (
    <Frame>
      <circle {...stroke} cx="24" cy="24" r="6" />
      <path
        {...stroke}
        d="M24 11v-3m0 32v-3m13-13h3M8 24H5m24.2-9.2 2.1-2.1M14.6 33.4l2.1-2.1m0-14.6-2.1-2.1m18.7 18.7-2.1-2.1"
      />
    </Frame>
  );
}

/** Design Team — an artist's palette: craft & experience. */
function Design() {
  return (
    <Frame>
      <path
        {...stroke}
        d="M24 9c-8.8 0-15 5.6-15 13 0 5.5 4 9 8.5 9 2.5 0 2.7-1.7 2.2-3-.6-1.6.4-3 2.3-3H27c5 0 12-2.3 12-9.5C39 13 33 9 24 9Z"
      />
      <circle {...stroke} cx="17" cy="19" r="1.4" />
      <circle {...stroke} cx="24" cy="16" r="1.4" />
      <circle {...stroke} cx="31" cy="19" r="1.4" />
    </Frame>
  );
}

/** Cross-functional — two figures: collaboration across teams. */
function Stakeholders() {
  return (
    <Frame>
      <circle {...stroke} cx="18" cy="17" r="4" />
      <circle {...stroke} cx="31" cy="19" r="3.4" />
      <path {...stroke} d="M11 36v-3a7 7 0 0 1 14 0v3" />
      <path {...stroke} d="M26 36v-3.5a6 6 0 0 1 11-3.2" />
    </Frame>
  );
}

const ICONS: Record<string, () => JSX.Element> = {
  "decision-makers": DecisionMakers,
  leaders: Leaders,
  "product-eng": ProductEng,
  design: Design,
  stakeholders: Stakeholders,
};

export default function PersonaIcon({ id, className }: Props) {
  const Icon = ICONS[id] ?? DecisionMakers;
  return (
    <span className={className}>
      <Icon />
    </span>
  );
}
