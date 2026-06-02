"use client";

import { useMemo } from "react";
import Markdown from "./Markdown";

type Section = {
  title: string;
  body: string;
  icon: string;
};

/** Pick an icon for a section based on its title. */
function iconFor(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("purpose")) return "🎯";
  if (t.includes("audience")) return "👥";
  if (t.includes("narrative") || t.includes("arc")) return "🎬";
  if (t.includes("message")) return "💬";
  if (t.includes("sharpen")) return "✨";
  return "📌";
}

/**
 * Splits the expert's Markdown into top-level ("## ") sections so each renders
 * as its own titled card. Content before the first heading (rare) becomes an
 * untitled intro block. Streaming-safe — recomputed as content grows.
 */
function splitSections(md: string): { intro: string; sections: Section[] } {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const sections: Section[] = [];
  let intro: string[] = [];
  let current: { title: string; body: string[] } | null = null;

  for (const line of lines) {
    const h2 = line.match(/^##\s+(?!#)(.*)$/);
    if (h2) {
      if (current) {
        sections.push({
          title: current.title,
          body: current.body.join("\n").trim(),
          icon: iconFor(current.title),
        });
      }
      current = { title: h2[1].trim(), body: [] };
    } else if (current) {
      current.body.push(line);
    } else {
      intro.push(line);
    }
  }
  if (current) {
    sections.push({
      title: current.title,
      body: current.body.join("\n").trim(),
      icon: iconFor(current.title),
    });
  }

  return { intro: intro.join("\n").trim(), sections };
}

export default function Output({ content }: { content: string }) {
  const { intro, sections } = useMemo(() => splitSections(content), [content]);

  // Before the first "## " arrives, show the raw stream so nothing flashes empty.
  if (sections.length === 0) {
    return <Markdown content={content} />;
  }

  return (
    <div className="space-y-4">
      {intro ? (
        <div className="prose-output text-[15px]">
          <Markdown content={intro} />
        </div>
      ) : null}

      {sections.map((s, i) => (
        <section
          key={i}
          className="animate-fade-up overflow-hidden rounded-xl border border-line bg-paper"
        >
          <div className="flex items-center gap-3 border-b border-line bg-paper-soft px-4 py-3 sm:px-5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-paper text-[15px] ring-1 ring-line">
              {s.icon}
            </span>
            <h2 className="text-[15px] font-semibold tracking-tight text-ink">
              {s.title}
            </h2>
            <span className="ml-auto text-[11px] font-medium tabular-nums text-ink-faint">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="px-4 py-3 sm:px-5 sm:py-4">
            <Markdown content={s.body} />
          </div>
        </section>
      ))}
    </div>
  );
}
