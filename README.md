# Narrative Excellence

A platform that helps people **tailor their presentations to their audience** and structure a narrative that moves people from A to B. Built around three pillars — **Audience**, **Idea**, and **Narrative** — coached by a Claude-powered Narrative Excellence Expert.

## How it works

A 4-step flow:

1. **Context** — paste your notes / doc (or drop a `.txt` / `.md` file), then sharpen your core message and the action you want.
2. **Audience** — pick one or more audience archetypes (Decision Makers, Leaders, Product & Eng, Design, Cross-functional). Each is persuaded differently.
3. **Goals** — pick what the talk should achieve (drive actions, make a decision, convince on strategy, alignment, buy-in, awareness, feedback, inspire).
4. **Tailor** — set the meeting length and generate.

The output, streamed live from the expert, includes a **sharpened purpose** (via the 5 Whys), **audience-tailored framing**, a time-boxed **narrative arc** (Setup → Build → Turn → Resolution / 起承轉合), a **ready-to-deliver message**, and pointed suggestions to sharpen further.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** — minimal black/white, Claude-inspired design
- **Claude API** (`claude-opus-4-8`) via `@anthropic-ai/sdk` — streaming, adaptive thinking, and prompt caching on the frozen system prompt

## Run locally

```bash
npm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000.

## Configuration

| Variable | Required | Description |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | yes | Your Anthropic API key. Without it, the API route returns a clear error. |

## Project layout

```
app/
  layout.tsx          Root layout + metadata
  page.tsx            The 4-step wizard + streamed result view
  globals.css         Tailwind + markdown output styles
  api/tailor/route.ts Streaming Claude endpoint
components/
  Markdown.tsx        Dependency-free markdown renderer
lib/
  personas.ts         Audience archetypes
  goals.ts            Presentation goals
  prompt.ts           System prompt + per-request prompt builder + validation
```
