# Handoff to Antigravity Agent — Open Notebook / Audioprism

**Purpose:** This document gives the next agent (Antigravity) everything needed to continue the project: what the project is, what was planned, what works now, and exactly where to start (including finishing the homepage and quality-of-life work for production).

---

## 1. What This Project Is

- **Product name in this fork:** **Audioprism** (UI title, branding). Under the hood it is **Open Notebook**.
- **What it does:** Open-source, privacy-focused alternative to Google Notebook LM. AI-powered research assistant: upload multi-modal content (PDFs, audio, video, web pages) → generate notes, semantic search, chat with AI, and produce **professional podcasts** (multi-speaker, TTS). Data and AI provider choice stay under your control.
- **Repo:** Open Notebook upstream (lfnovo/open-notebook). This codebase is a fork/customization for **BioLight** (see `overview.md`).
- **High-level goal for this fork:** Use Open Notebook as the “knowledge + scripting + podcast generation” core so the team can produce **3–4 podcast episodes/week** with minimal friction — ingest content, generate show-ready scripts, render audio (e.g. ElevenLabs voice clones), output publish-ready assets (MP3 + metadata + show notes). See `overview.md` for the full North Star.

**Tech stack (keep as-is):**

- **Frontend:** Next.js 16 (React 19), TypeScript, Tailwind CSS v4, shadcn/ui, Zustand, TanStack Query. Port **3000**. i18n: react-i18next; consider translation keys for any new UI.
- **API:** FastAPI, Python 3.11+, port **5055**. LangGraph workflows, SurrealDB (port 8000), Esperanto for multi-provider AI (OpenAI, Anthropic, Google, Groq, Ollama, ElevenLabs, etc.).
- **Database:** SurrealDB (graph DB, vector search, migrations on API startup).
- **Auth:** Clerk (`@clerk/nextjs`) for sign-in/sign-up. Frontend uses Clerk; API has optional password middleware for server-side (see CONFIGURATION.md for production auth).

---

## 2. What We Had Planned (Still To Do)

### 2.1 Homepage / Landing Page (Priority)

- **Current state:** There is **no real marketing homepage**. The app has:
  - **`/` (home):** Minimal landing: logo “Audioprism”, “Welcome”, “Admin sign in” button, no nav, no feature sections. Logged-in users are redirected to `/notebooks`.
  - **`/sign-in`:**
  - Centered Clerk sign-in only; no Prism or decorative background (Prism was removed).
- **Planned:** A full, production-ready **Audioprism Studio** landing page. The complete spec (sections, copy, design language, tech stack) is in **`V0_PROMPT.md`**. Use that file as the single source of truth for:
  - Sticky header/nav (Features, Use Cases, Pricing, Community; Sign In + Get Started).
  - Announcement pill, hero (two-column: copy + placeholder for future visual), trust bar (AI provider logos).
  - Feature bento grid, use cases, “How it works” activity log, value props, features grid, stats strip, social proof/beta CTA, pricing, FAQ, community, footer CTA, footer.
- **Design:** Dark-only SaaS (e.g. Linear/Vercel), glassmorphic cards, purple-to-cyan gradient accents, Inter/system font, responsive. Links: Get Started/Sign Up → `/sign-up`, Sign In → `/sign-in`.
- **Action:** Implement the layout and copy from `V0_PROMPT.md` (e.g. with a new template or by building sections in the app router). The “right column” hero placeholder is for a future WebGL/visual — no Prism anymore; a gradient or static visual is fine for now.

### 2.2 Other Plans (From overview.md + Roadmap)

- **BioLight Podcast Factory:** Ingest BioLight knowledge → generate episodes (multi-speaker) → render audio (ElevenLabs voice clones) → export MP3 + metadata + show notes. Episode Profiles + Speaker Profiles are in the app; keep improving reliability and UX.
- **Quality of life for production:** See Section 5 below.
- **Roadmap (README):** Live front-end updates, async processing, cross-notebook sources, bookmark integration. See GitHub issues for proposed features.

---

## 3. What Works Right Now (Proved Out / Stable)

Use this as the “known good” baseline. Don’t break these.

- **Audio / podcast generation**
  - **Local:** Podcast generation and TTS (e.g. ElevenLabs) work locally (scripts → audio, multi-speaker).
  - **Production:** Same flow has been proved out in production; audio generation and playback work end-to-end.
- **Auth**
  - Clerk sign-in and sign-up work. Home uses `auth()` from `@clerk/nextjs/server`; if `userId` exists, redirect to `/notebooks`. Sign-in page uses `SignInWithPrism` (component name is legacy; it’s just Clerk `<SignIn />` with custom appearance).
- **Core app (after login)**
  - **Notebooks:** List, create, open, delete.
  - **Sources:** Add (upload, URL, etc.), process, list, view; embeddings and processing work.
  - **Notes:** Create, edit, link to sources; AI-assisted notes.
  - **Chat:** Per-notebook chat with AI, context from selected sources/notes.
  - **Search:** Semantic + full-text across content.
  - **Podcasts:** Generate episodes (select sources/notes, episode profile, speaker profiles), job queue, status, retry on failure, download MP3. Episode retry and error display were added recently (CHANGELOG 1.7.3).
  - **Transformations:** Apply templates to sources; transformations UI and execution work.
  - **Settings:** API keys (credentials) per provider, model discovery/registration; settings and config.
  - **Advanced:** Background jobs, system info, rebuild embeddings (as per existing UI).
- **API**
  - FastAPI on 5055; REST for notebooks, sources, notes, chat, podcasts, commands, config. SurrealDB migrations run on startup.
- **Frontend stack**
  - Next.js 16, React 19, TypeScript, Tailwind v4, shadcn/ui. Connection guard (API/config check), theme provider, i18n, query client — all in use. No Prism; no `ogl` dependency.

**Fixes that were important (don’t regress):**

- **forEach / undefined guards:** Several `Cannot read properties of undefined (reading 'forEach')` bugs were fixed by guarding array usage (e.g. `Array.isArray(x) ? x : []`, optional chaining, default arrays) in:
  - `frontend/src/lib/hooks/use-sources.ts` (create source notebooks, add sources to notebook)
  - `frontend/src/lib/hooks/useNotebookChat.ts` (sources/notes in buildContext)
  - `frontend/src/app/(dashboard)/notebooks/components/ChatColumn.tsx`
  - `frontend/src/app/(dashboard)/notebooks/[id]/page.tsx`
  - `frontend/src/components/podcasts/GeneratePodcastDialog.tsx` (notebooks, sources, notes, selections)
  - `frontend/src/app/(dashboard)/settings/api-keys/page.tsx` (toggleAll filteredNames)
  - `frontend/src/lib/utils/source-references.tsx` (matches)
- **Prism removed:** Prism component and all references were removed (landing and sign-in no longer use it). `ogl` was removed from `package.json`. If you add a new hero visual, use a new component/template, not the old Prism.

---

## 4. Where to Start (Recommended Order for Antigravity)

1. **Read this file + `V0_PROMPT.md` + `overview.md`**  
   Align on: product (Audioprism/Open Notebook), BioLight podcast factory goal, and the exact landing page spec.

2. **Implement the homepage from `V0_PROMPT.md`**  
   - Add a proper marketing landing route (or replace/enhance the current `/` page) with all sections in the spec.  
   - Keep existing behavior: if user is logged in (`auth().userId`), redirect to `/notebooks`.  
   - Use the stack already in the project: Next.js 16 App Router, TypeScript, Tailwind v4, shadcn/ui, Lucide. Framer Motion is optional (spec mentions subtle animations).  
   - Ensure `/sign-in` and `/sign-up` stay as-is and linked from the new nav/CTAs.

3. **Then:** Quality-of-life and production-hardening (Section 5).

---

## 5. Quality of Life & Production Readiness (To Do)

- **Landing/marketing:** Finish homepage per `V0_PROMPT.md`; then consider SEO, meta tags, and any legal pages (Privacy, Terms) linked from the footer.
- **Reliability / UX:** Keep podcast generation robust (retries, clear errors, status). Ensure connection/API errors stay user-friendly (existing error classification and i18n).
- **Auth:** Clerk is the source of truth. For production, follow CONFIGURATION.md for any server-side auth or API protection.
- **Config:** API URL and config come from `/config` (or env). Don’t hardcode API URL in the frontend; keep using the existing config flow.
- **i18n:** New UI strings should go through the locale files under `frontend/src/lib/locales` (en-US, etc.); see `frontend/src/lib/locales/CLAUDE.md` and existing keys.
- **Performance:** Consider lazy loading for heavy dashboard views if needed; keep existing patterns (TanStack Query, Zustand).
- **Docs:** User-facing docs live in `docs/`. Update if you change flows or add features.

---

## 6. Key Files and Locations

- **Landing / home**
  - `frontend/src/app/page.tsx` — current minimal home (logo + welcome card + Admin sign in).
  - `frontend/src/app/(auth)/sign-in/[[...sign-in]]/page.tsx` — sign-in page.
  - `frontend/src/app/(auth)/sign-in/[[...sign-in]]/SignInWithPrism.tsx` — Clerk SignIn wrapper (appearance only).
- **Landing spec (full copy and structure)**
  - `V0_PROMPT.md` — use this as the spec for the new homepage.
- **Product/vision**
  - `overview.md` — BioLight × Open Notebook North Star, MVP phases, voice/style, guardrails.
  - `README.md` — Open Notebook features, quick start, provider matrix.
  - `CLAUDE.md` — architecture, three-tier, tech stack, quirks.
- **Config and env**
  - `CONFIGURATION.md` — env vars, production auth.
  - `frontend/.env.local` — local env (often gitignored); root `.env.local` may exist for runner.
- **API**
  - `api/` — FastAPI app; `open_notebook/` — core domain, graphs, AI, DB. See `api/CLAUDE.md`, `open_notebook/CLAUDE.md`.

---

## 7. State Summary (What We Figured Out / When It Worked)

- **Audio (local + production):** Podcast generation and TTS (e.g. ElevenLabs) were verified working both locally and in production. No change required for “audio on” state; just keep the existing podcast flow and credentials/config.
- **Landing:** Prism was removed; home and sign-in are simple (logo + card + Clerk). The “state that worked” for the app is: **minimal home + Clerk sign-in, no Prism, no ogl**. The next step is to add the full marketing homepage from `V0_PROMPT.md` without breaking auth or redirects.
- **Frontend stability:** The forEach/undefined fixes (see Section 3) are the current stable state for dashboard and podcast UI; avoid reintroducing unguarded `.forEach` on possibly undefined arrays.

---

## 8. Summary for Antigravity

- **Project:** Audioprism (Open Notebook fork) — AI research + podcasts; moving toward production with a polished landing and QoL improvements.
- **Immediate task:** Build the **full Audioprism Studio homepage** from `V0_PROMPT.md` (sections 1–15), keep `/sign-in` and `/sign-up`, preserve logged-in redirect from `/` to `/notebooks`.
- **Then:** Quality-of-life and production hardening (reliability, i18n, config, docs).
- **Do not:** Remove or break the forEach guards; re-add Prism/ogl; change auth flow (Clerk); hardcode API URL.
- **Reference:** `V0_PROMPT.md` (homepage spec), `overview.md` (vision/MVP), `CLAUDE.md` (architecture), this file (handoff and current state).

Good luck; the codebase is in a good state to add the homepage and then iterate toward production.
