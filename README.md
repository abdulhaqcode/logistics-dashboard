# Logistics live dashboard

Next.js (App Router) control-tower UI for **live orders**, **hub load**, **KPIs**, and an **activity feed**. Data is **seeded from** `GET /api/live` then **advanced in the browser** every few seconds so the board feels real-time without requiring WebSockets (ideal for Vercel serverless).

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel from GitHub

1. Push this folder to a GitHub repository (root of the repo should contain `package.json` and `next.config.ts`).
2. In [Vercel](https://vercel.com/new), choose **Import Project** and select the GitHub repo.
3. Vercel auto-detects Next.js; leave defaults and deploy.

No extra environment variables are required for the demo. Replace `/api/live` and the client tick logic with your TMS / OMS API or a real-time provider (Pusher, Ably, Supabase, etc.) when you connect production data.

## Project layout

- `src/app/api/live/route.ts` — initial snapshot (no-store).
- `src/lib/logistics-simulator.ts` — demo state machine for orders and hubs.
- `src/hooks/use-live-logistics.ts` — fetch + client-side updates.
- `src/components/dashboard/*` — dashboard sections.
