"use client";

import Link from "next/link";
import { useState } from "react";
import { FRAMEWORKS, frameworkById } from "@/lib/frameworks";
import { goalById } from "@/lib/goals";

export default function LibraryPage() {
  const [selectedId, setSelectedId] = useState(FRAMEWORKS[0].id);
  const fw = frameworkById(selectedId)!;

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="border-b border-line bg-paper/80 backdrop-blur">
        <div className="mx-auto flex max-w-content items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-ink text-[13px] font-semibold text-white">
              NE
            </div>
            <div className="leading-tight">
              <div className="text-[15px] font-semibold tracking-tight">
                Framework Library
              </div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                What “good” looks like
              </div>
            </div>
          </div>
          <Link
            href="/"
            className="rounded-lg border border-line bg-paper px-3.5 py-2 text-[13px] text-ink-soft transition hover:border-ink-faint"
          >
            ← Back to the tool
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-content px-5 pb-24 pt-8 sm:px-8">
        <div className="mb-8 animate-fade-up">
          <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
            Gallery
          </div>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight sm:text-[28px]">
            Narrative frameworks, with gold-standard examples
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            Not sure what a great talk looks like? Each framework below is a
            proven shape for structuring a meeting, paired with a fully worked
            example and notes on why each move lands. Use them as the target to
            aim for.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          {/* Left rail: framework list */}
          <nav className="md:col-span-4 lg:col-span-3">
            <ul className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-visible md:pb-0">
              {FRAMEWORKS.map((f) => {
                const on = f.id === selectedId;
                return (
                  <li key={f.id} className="shrink-0 md:shrink">
                    <button
                      onClick={() => setSelectedId(f.id)}
                      className={[
                        "w-full rounded-xl border p-3.5 text-left transition",
                        on
                          ? "border-ink bg-paper ring-1 ring-ink"
                          : "border-line bg-paper hover:border-ink-faint",
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={[
                            "rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                            on
                              ? "bg-ink text-white"
                              : "bg-paper-edge text-ink-muted",
                          ].join(" ")}
                        >
                          {f.abbrev}
                        </span>
                      </div>
                      <div className="mt-2 text-[14px] font-semibold leading-snug tracking-tight">
                        {f.name}
                      </div>
                      <div className="mt-1 text-[12px] leading-snug text-ink-muted">
                        {f.tagline}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Detail panel */}
          <section className="md:col-span-8 lg:col-span-9">
            <div
              key={fw.id}
              className="animate-fade-up overflow-hidden rounded-2xl border border-line bg-paper"
            >
              {/* Header */}
              <div className="border-b border-line bg-paper-soft px-5 py-5 sm:px-7">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-ink px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                    {fw.abbrev}
                  </span>
                  {fw.bestForGoals.map((g) => {
                    const goal = goalById(g);
                    if (!goal) return null;
                    return (
                      <span
                        key={g}
                        className="inline-flex items-center gap-1 rounded-full bg-paper-edge px-2.5 py-0.5 text-[12px] text-ink-muted"
                      >
                        <span>{goal.emoji}</span>
                        {goal.label}
                      </span>
                    );
                  })}
                </div>
                <h2 className="mt-3 text-[20px] font-semibold tracking-tight">
                  {fw.name}
                </h2>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-muted">
                  <span className="font-medium text-ink-soft">When to use:</span>{" "}
                  {fw.whenToUse}
                </p>
              </div>

              {/* Worked example */}
              <div className="px-5 py-5 sm:px-7">
                <div className="mb-4 rounded-lg border border-line bg-paper-soft px-4 py-3 text-[13px] leading-relaxed text-ink-muted">
                  <span className="font-medium text-ink-soft">Example —</span>{" "}
                  {fw.scenario}
                </div>

                <ol className="space-y-4">
                  {fw.steps.map((s, i) => (
                    <li
                      key={i}
                      className="relative rounded-xl border border-line bg-paper p-4 sm:p-5"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[12px] font-semibold text-white">
                          {i + 1}
                        </span>
                        <span className="text-[14px] font-semibold tracking-tight">
                          {s.label}
                        </span>
                        <span className="text-[12px] text-ink-faint">
                          · {s.purpose}
                        </span>
                      </div>

                      <p className="mt-3 border-l-2 border-ink/15 pl-3 text-[15px] italic leading-relaxed text-ink">
                        “{s.example}”
                      </p>

                      <p className="mt-3 flex gap-2 rounded-lg bg-accent/[0.06] px-3 py-2 text-[13px] leading-relaxed text-ink-soft">
                        <span className="select-none text-accent">✎</span>
                        <span>
                          <span className="font-medium text-accent">
                            Why it works:{" "}
                          </span>
                          {s.annotation}
                        </span>
                      </p>
                    </li>
                  ))}
                </ol>

                {/* Tailor it */}
                <div className="mt-5 flex gap-2.5 rounded-xl border border-accent/20 bg-accent/[0.05] p-4 sm:p-5">
                  <span className="select-none text-accent">↔</span>
                  <p className="text-[13px] leading-relaxed text-ink-soft">
                    <span className="font-medium text-accent">
                      Tailor it to the room:{" "}
                    </span>
                    {fw.tailoring}
                  </p>
                </div>

                {/* What makes it A+ */}
                <div className="mt-5 rounded-xl border border-line bg-paper-soft p-4 sm:p-5">
                  <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
                    Self-check — does yours pass?
                  </div>
                  <ul className="mt-3 space-y-2">
                    {fw.tells.map((t, i) => (
                      <li
                        key={i}
                        className="flex gap-2.5 text-[14px] leading-relaxed text-ink-soft"
                      >
                        <span className="mt-0.5 select-none text-ink">✓</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
