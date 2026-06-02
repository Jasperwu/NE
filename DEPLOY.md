# Deploying to Vercel

This is a standard Next.js app — Vercel auto-detects everything. The only
required step beyond importing the repo is setting the Anthropic API key.

## Steps (~2 minutes)

1. Go to **https://vercel.com/new**
2. **Import** the repository: `Jasperwu/NE`
   - If you want to deploy this PR branch instead of `main`, after import open
     **Settings → Git** and set the Production Branch, or just merge the PR into
     `main` first.
3. Vercel detects **Next.js** automatically — leave Build & Output settings as
   default and click **Deploy**.
4. After the first build, open **Settings → Environment Variables** and add:

   | Name | Value | Environments |
   | --- | --- | --- |
   | `ANTHROPIC_API_KEY` | `sk-ant-...` (from https://console.anthropic.com/) | Production, Preview, Development |

5. Trigger a redeploy: **Deployments → … → Redeploy** (so the new env var is
   picked up).
6. Your live URL will be `https://<project-name>.vercel.app`.

## Notes

- No `vercel.json` is needed — the framework preset handles build (`next build`)
  and routing.
- The `/api/tailor` route streams responses and is configured with
  `maxDuration = 60`, which is within Vercel's serverless limits.
- Without `ANTHROPIC_API_KEY`, the app loads but the API route returns a clear
  error instead of generating — set the key to enable tailoring.
- Keep your API key secret. It is only read server-side in the API route and is
  never exposed to the browser.
