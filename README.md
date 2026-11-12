# HYBRID.OPS — B2B Lead & Pipeline Command Center
### Production Next.js (App Router) + n8n AI Lead Qualification Engine

An ultra-luxurious, production-ready "White Water Glassmorphic" command center designed for B2B agencies and high-ticket real estate firms.

---

## ⚡ n8n AI Node Ingestion Schema

The `/api/leads/webhook` endpoint accepts both the exact snake_case JSON schema from your n8n AI node as well as standard camelCase payloads.

### Exact n8n AI Output Schema:
```json
{
  "company_name": "Apex Horizon Residential",
  "location": "Austin, TX (Westlake Hills)",
  "website": "https://apexhorizon.com",
  "decision_maker": "Marcus Vance",
  "role": "Managing Principal & Head of Acquisitions",
  "email": "marcus@apexhorizon.com",
  "linkedin": "https://linkedin.com/in/marcus-vance-realestate",
  "lead_score": 94,
  "status": "HOT",
  "bottlenecks": "Mobile Safari 500 error on VIP inquiry form; 5.8s LCP hero block",
  "personalized_hook": "Saw Apex Horizon's premier Westlake listing portfolio, but your mobile VIP inquiry form is throwing a 500 server error on iOS Safari.",
  "audit_timestamp": "2026-11-12T15:20:00Z"
}
```

---

## 🚀 Netlify Deployment Guide

This project is configured for **Netlify** using [`@netlify/plugin-nextjs`](https://www.npmjs.com/package/@netlify/plugin-nextjs), ensuring that Next.js App Router API routes (`/api/leads/webhook`, `/api/n8n/trigger`) run as Serverless Functions with zero configuration.

### Deployment Method 1: Git Push (Recommended)
1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In Netlify, click **"Add new site"** → **"Import an existing project"**.
3. Select your repository.
4. Netlify will auto-detect `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Plugin**: `@netlify/plugin-nextjs`
5. Under **Environment variables**, set:
   - `NEXT_PUBLIC_N8N_PRODUCTION_URL` = `https://b2b-web-lead-engine.app.n8n.cloud/webhook/b2b-lead-qualification`
6. Click **Deploy Site**.

### Deployment Method 2: Netlify CLI
Run the following in the project root:
```bash
npx netlify deploy --build --prod
```

---

## 🌐 Dynamic URL Architecture
All endpoint displays, copy buttons, and n8n node templates adapt dynamically using `window.location.origin`:
- On local dev: `http://localhost:3000/api/leads/webhook`
- On Netlify: `https://<your-site-name>.netlify.app/api/leads/webhook`

---

## 🛠 Local Development

```bash
npm run dev
```

Visit `http://localhost:3000` to access the Command Center.
