"use client";

import { useCallback, useRef, useState } from "react";
import { PERSONAS } from "@/lib/personas";
import { GOALS } from "@/lib/goals";
import Output from "@/components/Output";

const DURATIONS = [15, 30, 45, 60];

const STEPS = ["Context", "Audience", "Goals", "Tailor"] as const;

export default function Home() {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<"form" | "result">("form");

  // Form state
  const [context, setContext] = useState("");
  const [coreMessage, setCoreMessage] = useState("");
  const [desiredAction, setDesiredAction] = useState("");
  const [audienceIds, setAudienceIds] = useState<string[]>([]);
  const [goalIds, setGoalIds] = useState<string[]>([]);
  const [durationMinutes, setDurationMinutes] = useState(30);

  // Output state
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const toggle = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    id: string,
  ) =>
    setter((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const hasContent = (context + coreMessage + desiredAction).trim().length > 0;
  const canTailor = hasContent && audienceIds.length > 0;

  const onFile = useCallback(async (file: File) => {
    const text = await file.text();
    setContext((prev) => (prev ? prev + "\n\n" + text : text));
  }, []);

  const tailor = useCallback(async () => {
    setPhase("result");
    setLoading(true);
    setError(null);
    setOutput("");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context,
          coreMessage,
          desiredAction,
          audienceIds,
          goalIds,
          durationMinutes,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `Request failed (${res.status}).`);
      }
      if (!res.body) throw new Error("No response stream.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setOutput((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError((err as Error).message);
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [
    context,
    coreMessage,
    desiredAction,
    audienceIds,
    goalIds,
    durationMinutes,
  ]);

  const reset = () => {
    abortRef.current?.abort();
    setPhase("form");
    setOutput("");
    setError(null);
    setStep(STEPS.length - 1);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto w-full max-w-content px-5 pb-24 pt-8 sm:px-8">
        {phase === "form" ? (
          <>
            <Stepper current={step} onJump={setStep} canTailor={canTailor} />

            <div className="mt-8">
              {step === 0 && (
                <ContextStep
                  context={context}
                  setContext={setContext}
                  coreMessage={coreMessage}
                  setCoreMessage={setCoreMessage}
                  desiredAction={desiredAction}
                  setDesiredAction={setDesiredAction}
                  onFile={onFile}
                />
              )}

              {step === 1 && (
                <AudienceStep
                  selected={audienceIds}
                  onToggle={(id) => toggle(setAudienceIds, id)}
                />
              )}

              {step === 2 && (
                <GoalsStep
                  selected={goalIds}
                  onToggle={(id) => toggle(setGoalIds, id)}
                />
              )}

              {step === 3 && (
                <TailorStep
                  context={context}
                  coreMessage={coreMessage}
                  desiredAction={desiredAction}
                  audienceIds={audienceIds}
                  goalIds={goalIds}
                  durationMinutes={durationMinutes}
                  setDurationMinutes={setDurationMinutes}
                />
              )}
            </div>

            <NavBar
              step={step}
              setStep={setStep}
              canTailor={canTailor}
              onTailor={tailor}
            />
          </>
        ) : (
          <ResultView
            output={output}
            loading={loading}
            error={error}
            onBack={reset}
            onRegenerate={tailor}
          />
        )}
      </main>
    </div>
  );
}

/* ------------------------------ Header ------------------------------ */

function Header() {
  return (
    <header className="border-b border-line bg-paper/80 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-5 py-4 sm:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-ink text-[13px] font-semibold text-white">
            NE
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-semibold tracking-tight">
              Narrative Excellence
            </div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-ink-faint">
              Tailor your message
            </div>
          </div>
        </div>
        <span className="hidden text-[13px] text-ink-muted sm:inline">
          Get buy-in for your idea
        </span>
      </div>
    </header>
  );
}

/* ------------------------------ Stepper ------------------------------ */

function Stepper({
  current,
  onJump,
  canTailor,
}: {
  current: number;
  onJump: (n: number) => void;
  canTailor: boolean;
}) {
  return (
    <nav className="flex items-center gap-2 sm:gap-3">
      {STEPS.map((label, i) => {
        const active = i === current;
        const done = i < current;
        const locked = i === 3 && !canTailor;
        return (
          <button
            key={label}
            onClick={() => !locked && onJump(i)}
            disabled={locked}
            className={[
              "flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] transition",
              active
                ? "bg-ink text-white"
                : done
                  ? "bg-paper text-ink ring-1 ring-line hover:ring-ink-faint"
                  : "text-ink-faint hover:text-ink-muted",
              locked ? "cursor-not-allowed opacity-50" : "cursor-pointer",
            ].join(" ")}
          >
            <span
              className={[
                "flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold",
                active
                  ? "bg-white text-ink"
                  : done
                    ? "bg-ink text-white"
                    : "bg-paper-edge text-ink-faint",
              ].join(" ")}
            >
              {done ? "✓" : i + 1}
            </span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* --------------------------- Step 1: Context --------------------------- */

function SectionHeading({
  step,
  title,
  hint,
}: {
  step: string;
  title: string;
  hint: string;
}) {
  return (
    <div className="mb-6 animate-fade-up">
      <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
        {step}
      </div>
      <h1 className="mt-1.5 text-2xl font-semibold tracking-tight sm:text-[28px]">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
        {hint}
      </p>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-ink-soft">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-[15px] text-ink outline-none transition placeholder:text-ink-faint focus:border-ink-faint focus:ring-4 focus:ring-paper-edge";

function ContextStep({
  context,
  setContext,
  coreMessage,
  setCoreMessage,
  desiredAction,
  setDesiredAction,
  onFile,
}: {
  context: string;
  setContext: (v: string) => void;
  coreMessage: string;
  setCoreMessage: (v: string) => void;
  desiredAction: string;
  setDesiredAction: (v: string) => void;
  onFile: (f: File) => void;
}) {
  const [drag, setDrag] = useState(false);
  return (
    <div>
      <SectionHeading
        step="Step 1 — Context"
        title="What are you presenting?"
        hint="Paste the raw material for your talk — notes, a doc, bullet points, anything. Then sharpen the core message and the action you want."
      />

      <div className="grid gap-5">
        <Field label="Narrative context">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              const file = e.dataTransfer.files?.[0];
              if (file) onFile(file);
            }}
            className={[
              "rounded-lg border transition",
              drag ? "border-accent ring-4 ring-paper-edge" : "border-line",
            ].join(" ")}
          >
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={9}
              placeholder="Paste your notes or document here… or drop a .txt / .md file."
              className="w-full resize-y rounded-lg bg-paper px-3.5 py-3 text-[15px] leading-relaxed text-ink outline-none placeholder:text-ink-faint"
            />
            <div className="flex items-center justify-between border-t border-line px-3.5 py-2">
              <label className="cursor-pointer text-[13px] text-ink-muted transition hover:text-ink">
                <input
                  type="file"
                  accept=".txt,.md,.markdown,text/plain"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onFile(file);
                    e.target.value = "";
                  }}
                />
                ⬆ Upload a .txt / .md file
              </label>
              <span className="text-[12px] text-ink-faint">
                {context.trim().length.toLocaleString()} chars
              </span>
            </div>
          </div>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Core message — the one thing they should remember">
            <textarea
              value={coreMessage}
              onChange={(e) => setCoreMessage(e.target.value)}
              rows={3}
              placeholder="e.g. We should pause new features and fix reliability this quarter."
              className={inputClass + " resize-y leading-relaxed"}
            />
          </Field>
          <Field label="Desired action — what do you want them to do?">
            <textarea
              value={desiredAction}
              onChange={(e) => setDesiredAction(e.target.value)}
              rows={3}
              placeholder="e.g. Approve a 6-week reliability sprint and reassign two engineers."
              className={inputClass + " resize-y leading-relaxed"}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Step 2: Audience --------------------------- */

function AudienceStep({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      <SectionHeading
        step="Step 2 — Audience"
        title="Who is in the room?"
        hint="Pick every audience you're speaking to. Each is persuaded differently — we'll tailor the framing for each one. Select one or more."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PERSONAS.map((p) => {
          const on = selected.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => onToggle(p.id)}
              className={[
                "group flex flex-col rounded-xl border p-4 text-left transition",
                on
                  ? "border-ink bg-paper shadow-[0_1px_0_rgba(20,20,19,0.04)] ring-1 ring-ink"
                  : "border-line bg-paper hover:border-ink-faint",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <div
                  className={[
                    "flex h-10 w-10 items-center justify-center rounded-full text-lg",
                    p.avatar,
                  ].join(" ")}
                >
                  {p.emoji}
                </div>
                <span
                  className={[
                    "flex h-5 w-5 items-center justify-center rounded-full border text-[11px] transition",
                    on
                      ? "border-ink bg-ink text-white"
                      : "border-line text-transparent group-hover:border-ink-faint",
                  ].join(" ")}
                >
                  ✓
                </span>
              </div>
              <div className="mt-3 text-[15px] font-semibold tracking-tight">
                {p.name}
              </div>
              <div className="text-[12px] uppercase tracking-[0.1em] text-ink-faint">
                {p.role}
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                {p.cares}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------- Step 3: Goals ---------------------------- */

function GoalsStep({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      <SectionHeading
        step="Step 3 — Goals"
        title="What should this presentation achieve?"
        hint="The goal is the action you want to move the audience toward. Pick all that apply."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {GOALS.map((g) => {
          const on = selected.includes(g.id);
          return (
            <button
              key={g.id}
              onClick={() => onToggle(g.id)}
              className={[
                "flex items-start gap-3 rounded-xl border p-4 text-left transition",
                on
                  ? "border-ink bg-paper ring-1 ring-ink"
                  : "border-line bg-paper hover:border-ink-faint",
              ].join(" ")}
            >
              <span className="text-xl leading-none">{g.emoji}</span>
              <span>
                <span className="block text-[15px] font-semibold tracking-tight">
                  {g.label}
                </span>
                <span className="mt-0.5 block text-[13px] leading-relaxed text-ink-muted">
                  {g.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------- Step 4: Tailor ---------------------------- */

function TailorStep({
  context,
  coreMessage,
  desiredAction,
  audienceIds,
  goalIds,
  durationMinutes,
  setDurationMinutes,
}: {
  context: string;
  coreMessage: string;
  desiredAction: string;
  audienceIds: string[];
  goalIds: string[];
  durationMinutes: number;
  setDurationMinutes: (n: number) => void;
}) {
  const audiences = PERSONAS.filter((p) => audienceIds.includes(p.id));
  const goals = GOALS.filter((g) => goalIds.includes(g.id));

  return (
    <div>
      <SectionHeading
        step="Step 4 — Tailor"
        title="Review and tailor"
        hint="Set the meeting length so we can shape the narrative arc, then generate your tailored message."
      />

      <Field label="Meeting length">
        <div className="flex flex-wrap gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDurationMinutes(d)}
              className={[
                "rounded-full px-4 py-2 text-[14px] transition",
                durationMinutes === d
                  ? "bg-ink text-white"
                  : "border border-line bg-paper text-ink-soft hover:border-ink-faint",
              ].join(" ")}
            >
              {d} min
            </button>
          ))}
        </div>
      </Field>

      <div className="mt-6 grid gap-3 rounded-xl border border-line bg-paper p-5">
        <Summary label="Audience">
          {audiences.length ? (
            <div className="flex flex-wrap gap-1.5">
              {audiences.map((a) => (
                <span
                  key={a.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-paper-edge px-2.5 py-1 text-[13px]"
                >
                  <span>{a.emoji}</span>
                  {a.name}
                </span>
              ))}
            </div>
          ) : (
            <Empty>No audience selected yet</Empty>
          )}
        </Summary>

        <Summary label="Goals">
          {goals.length ? (
            <div className="flex flex-wrap gap-1.5">
              {goals.map((g) => (
                <span
                  key={g.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-paper-edge px-2.5 py-1 text-[13px]"
                >
                  <span>{g.emoji}</span>
                  {g.label}
                </span>
              ))}
            </div>
          ) : (
            <Empty>No goals selected (optional)</Empty>
          )}
        </Summary>

        <Summary label="Core message">
          {coreMessage.trim() ? (
            <p className="text-[14px] text-ink-soft">{coreMessage.trim()}</p>
          ) : (
            <Empty>Not specified</Empty>
          )}
        </Summary>

        <Summary label="Desired action">
          {desiredAction.trim() ? (
            <p className="text-[14px] text-ink-soft">{desiredAction.trim()}</p>
          ) : (
            <Empty>Not specified</Empty>
          )}
        </Summary>

        <Summary label="Context">
          <p className="text-[13px] text-ink-muted">
            {context.trim()
              ? `${context.trim().length.toLocaleString()} characters provided`
              : "None provided"}
          </p>
        </Summary>
      </div>
    </div>
  );
}

function Summary({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[110px_1fr] items-start gap-3 border-b border-line pb-3 last:border-0 last:pb-0">
      <span className="pt-0.5 text-[12px] font-medium uppercase tracking-[0.1em] text-ink-faint">
        {label}
      </span>
      <div>{children}</div>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <span className="text-[13px] italic text-ink-faint">{children}</span>;
}

/* ----------------------------- Nav bar ----------------------------- */

function NavBar({
  step,
  setStep,
  canTailor,
  onTailor,
}: {
  step: number;
  setStep: (n: number) => void;
  canTailor: boolean;
  onTailor: () => void;
}) {
  const isLast = step === STEPS.length - 1;
  return (
    <div className="mt-10 flex items-center justify-between border-t border-line pt-5">
      <button
        onClick={() => setStep(Math.max(0, step - 1))}
        disabled={step === 0}
        className="rounded-lg px-4 py-2.5 text-[14px] text-ink-muted transition hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
      >
        ← Back
      </button>

      {isLast ? (
        <button
          onClick={onTailor}
          disabled={!canTailor}
          className="rounded-lg bg-ink px-6 py-2.5 text-[14px] font-medium text-white transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-40"
        >
          ✦ Tailor my message
        </button>
      ) : (
        <button
          onClick={() => setStep(step + 1)}
          className="rounded-lg bg-ink px-6 py-2.5 text-[14px] font-medium text-white transition hover:bg-ink-soft"
        >
          Continue →
        </button>
      )}
    </div>
  );
}

/* ----------------------------- Result view ----------------------------- */

function ResultView({
  output,
  loading,
  error,
  onBack,
  onRegenerate,
}: {
  output: string;
  loading: boolean;
  error: string | null;
  onBack: () => void;
  onRegenerate: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
            From the Narrative Excellence Expert
          </div>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight">
            Your tailored message
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="rounded-lg border border-line bg-paper px-3.5 py-2 text-[13px] text-ink-soft transition hover:border-ink-faint"
          >
            ← Edit inputs
          </button>
          <button
            onClick={onRegenerate}
            disabled={loading}
            className="rounded-lg border border-line bg-paper px-3.5 py-2 text-[13px] text-ink-soft transition hover:border-ink-faint disabled:opacity-40"
          >
            ↻ Regenerate
          </button>
          <button
            onClick={copy}
            disabled={!output || loading}
            className="rounded-lg bg-ink px-3.5 py-2 text-[13px] font-medium text-white transition hover:bg-ink-soft disabled:opacity-40"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-accent/30 bg-accent/5 p-4 text-[14px] text-accent">
          {error}
        </div>
      ) : null}

      {!output && loading ? (
        <div className="flex items-center gap-2 rounded-xl border border-line bg-paper p-6 text-[14px] text-ink-muted">
          <Dot /> <Dot /> <Dot />
          <span className="ml-1">Shaping your narrative…</span>
        </div>
      ) : (
        <>
          <Output content={output} />
          {loading ? (
            <div className="mt-3 flex items-center gap-2 text-[13px] text-ink-faint">
              <span className="inline-block h-3.5 w-1.5 animate-pulse bg-ink-faint align-middle" />
              <span>Still writing…</span>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

function Dot() {
  return (
    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-faint [animation-delay:var(--d)]" />
  );
}
