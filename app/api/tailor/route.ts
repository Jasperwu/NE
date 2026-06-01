import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, buildUserPrompt, validateRequest } from "@/lib/prompt";

// Stream tokens as they arrive — the response can be long, and streaming
// avoids HTTP timeouts on large outputs.
export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error:
          "Missing ANTHROPIC_API_KEY. Set it in the environment to enable message tailoring.",
      },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const request = validateRequest(body);
  if (!request) {
    return Response.json(
      {
        error:
          "Please add some context or a core message, and select at least one audience.",
      },
      { status: 400 },
    );
  }

  const client = new Anthropic({ apiKey });
  const userPrompt = buildUserPrompt(request);

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const messageStream = client.messages.stream({
          model: "claude-opus-4-8",
          max_tokens: 4096,
          // Let Claude decide how much to reason — tailoring is a judgment task.
          thinking: { type: "adaptive" },
          // Frozen system prompt → cache it so repeated requests are cheaper/faster.
          system: [
            {
              type: "text",
              text: SYSTEM_PROMPT,
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: [{ role: "user", content: userPrompt }],
        });

        for await (const event of messageStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }

        await messageStream.finalMessage();
        controller.close();
      } catch (err) {
        const message =
          err instanceof Anthropic.APIError
            ? `Claude API error (${err.status ?? "?"}): ${err.message}`
            : err instanceof Error
              ? err.message
              : "Unexpected error while generating the message.";
        controller.enqueue(encoder.encode(`\n\n[ERROR] ${message}`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
