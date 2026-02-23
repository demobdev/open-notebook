# v0 Prompt — Audioprism Studio Homepage

Paste everything below (including the horizontal rules) into v0.dev as a single prompt.

---

Create a full, production-ready landing page for "Audioprism Studio" — an AI-powered platform that turns uploaded content (PDFs, audio, video, web pages) into smart research notes, semantic search, and professional AI-generated podcasts.

## Tech Stack
- Next.js 16 App Router (React 19)
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Lucide React icons
- Framer Motion for subtle animations
- Dark theme only (dark background: `#09090b` or similar near-black)

## Design Language
- Dark-mode SaaS aesthetic similar to Linear, Vercel, or the Magic UI "devtool" template
- Glassmorphic cards with subtle `border-border/40` borders and soft glow accents
- Purple-to-cyan gradient accent palette (`from-[#bd34fe] to-[#41d1ff]`)
- Clean sans-serif typography (Inter or system font stack)
- Generous whitespace, tight copy, no walls of text
- Responsive: fully mobile-friendly with a single-column stack on small screens

---

## SECTION 1: Sticky Header / Navigation

- Logo: "Audioprism" text + small logo icon on the left
- Nav items (center or right): Features, Use Cases, Pricing, Community
- Right side: "Sign In" text link + "Get Started" primary button (small, rounded)
- Sticky on scroll with a subtle backdrop blur
- Mobile: hamburger menu

---

## SECTION 2: Announcement Banner (Pill)

- Centered above the hero
- Small rounded pill/badge: `New — Introducing Audioprism Studio`
- Subtle border, small arrow icon on the right
- Links to `/sign-up` or scrolls to hero

---

## SECTION 3: Hero

**Layout:** Two-column on desktop (text left, visual right). Single column on mobile (text only, visual hidden).

**Left column:**
- Headline: `Audioprism Studio` (large, bold, white)
- Subheadline: `Turn any content into AI-powered podcasts, smart notes, and semantic search — no setup. Upload and go.` (muted text, max ~60ch per line)
- Two buttons:
  - Primary: `Get Started` (gradient or solid primary button)
  - Secondary: `Watch Demo` (outline/ghost button with play icon)
- Microcopy below buttons: `Free to try • No credit card required`

**Right column (desktop only, `hidden lg:block`):**
- A decorative visual placeholder — use a large rounded container (`rounded-2xl overflow-hidden`) with a purple/cyan gradient mesh background or an abstract SVG pattern
- Size: roughly 520×420px
- This is where a WebGL Prism animation will go later — for now, use a gradient placeholder with soft glow

**Trust bar (below hero, full width):**
- Small label: `Powered by leading AI providers`
- Row of 6 grayscale/muted logos (use placeholder text badges if no SVGs): OpenAI, ElevenLabs, Anthropic, Google, Mistral, Groq
- Logos should be muted/gray, with subtle hover brightening
- Infinite horizontal scroll animation on mobile (marquee style)

---

## SECTION 4: Feature Bento Grid (4 cards)

**Section heading:** `Everything you need to go from raw content to finished podcast`

**Layout:** 2×2 grid on desktop, single column on mobile. Cards should be large, dark glassmorphic panels with an icon, title, and one-line description.

Cards:

1. **Upload Anything** (Upload icon)
   `PDFs, audio, video, web pages — drop it in and AI handles the rest.`

2. **AI Podcast Studio** (Mic icon)
   `Generate multi-voice episodes in minutes — intros, segments, and polish.`

3. **Smart Research Notes** (FileText icon)
   `Auto-summaries, key takeaways, and structured notes across notebooks.`

4. **Semantic Search** (Search icon)
   `Ask questions in plain English and jump to the exact source.`

Each card should have:
- A subtle gradient border or glow on hover
- An icon in a rounded container with a faint colored background
- Title in white, description in muted gray

---

## SECTION 5: Use Cases (3 icon cards)

**Section heading:** `Built for people who create, research, and learn`

**Layout:** 3-column grid, single column on mobile. Slightly smaller cards than bento.

1. **Content Creators** (Video icon)
   `Repurpose articles, interviews, and research into polished podcast episodes.`

2. **Research Teams** (BookOpen icon)
   `Index hundreds of documents and surface answers with semantic search.`

3. **Students & Lifelong Learners** (GraduationCap icon)
   `Turn messy reading lists into study notes, summaries, and audio you'll finish.`

---

## SECTION 6: Activity Log / "How It Works" Section

**Section heading:** `From raw content to finished podcast`
**Section subheading:** `Watch research transform into polished audio in real time.`

**Layout:** A dark card/terminal-style block showing a faux activity log with monospaced font and colored status badges:

```
[10:23:45]  UPLOAD    3 sources added to "Q1 Research"
[10:23:47]  PROCESS   Extracting content from earnings-report.pdf...
[10:23:50]  NOTES     12 key insights generated across 3 sources
[10:23:52]  PODCAST   Generating 8-minute episode with 2 AI voices...
[10:23:55]  COMPLETE  "Q1 Deep Dive" episode ready to play
```

- Each status keyword (UPLOAD, PROCESS, NOTES, PODCAST, COMPLETE) should be a colored badge:
  - UPLOAD: blue
  - PROCESS: amber
  - NOTES: purple
  - PODCAST: cyan
  - COMPLETE: green
- Animate the lines in one by one with a staggered fade-in (like a real terminal)
- Below the log: a small audio player placeholder bar with a label: `Listen to a sample episode` and a play button (non-functional placeholder)

---

## SECTION 7: Two-Up Value Props (side by side)

**Layout:** Two equal cards side by side on desktop, stacked on mobile.

**Left card:**
- Title: `Your keys or ours — you choose`
- Description: `Start instantly with Audioprism-managed AI, or bring your own OpenAI / ElevenLabs keys for maximum control and lower cost.`
- Small icon: Key

**Right card:**
- Title: `Private by default`
- Description: `Keep notebooks scoped to your account. Your content stays yours — and your keys are encrypted at rest.`
- Small icon: Shield

---

## SECTION 8: Features Grid (6 cards)

**Section heading:** `Built for speed, built for privacy`

**Layout:** 3×2 grid on desktop, 2-column on tablet, single column on mobile. Smaller, more compact cards than the bento.

1. **Multi-Modal Ingestion** (Layers icon) — `Upload PDFs, audio, video, and web pages. Everything gets parsed and indexed.`
2. **AI Podcast Generation** (Headphones icon) — `Create multi-voice episodes with clean structure, pacing, and polish.`
3. **Semantic Search** (Sparkles icon) — `Ask questions across all your sources and get grounded answers fast.`
4. **Provider Flexibility** (Shuffle icon) — `Swap models when you want — or use your own keys anytime.`
5. **Notebooks & Notes** (BookOpen icon) — `Organize sources into notebooks with summaries, insights, and transformations.`
6. **Secure by Design** (Lock icon) — `Modern auth, encrypted credentials, and usage limits that prevent surprises.`

---

## SECTION 9: Stats Strip

**Layout:** 3 large stat blocks in a row, centered. Each has a large number and a small label below it.

- `50+` — `File types supported`
- `8+` — `AI providers integrated`
- `< 5 min` — `From upload to podcast`

Numbers should be large (text-4xl or text-5xl), white, bold. Labels in muted gray. Consider a subtle count-up animation on scroll.

---

## SECTION 10: Social Proof / Beta CTA

Since there are no testimonials yet, use a single centered block:

**Layout:** A large card, centered, with a subtle gradient border.

- Quote: `"Audioprism exists because great ideas shouldn't die in unread PDFs."`
- Attribution: `— Founder, Audioprism`

Below the quote card, a CTA block:
- Title: `Join the beta`
- Subtitle: `Get early access and help shape the fastest way to turn content into audio.`
- Button: `Get Started`

---

## SECTION 11: Pricing Section

**Section heading:** `Simple pricing that scales with your usage.`
**Section subheading:** `Start free. Upgrade when you want more output — or bring your own keys for maximum control.`

**Layout:** 3 pricing cards in a row. The middle card (Pro) should be visually highlighted (gradient border, "Popular" badge, slightly elevated).

### Free — $0/month
- `Get started with AI research.`
- 20 chat messages/day
- 100 pages indexed/month
- 1 notebook
- Community support
- **CTA:** `Get Started Free` (outline button)

### Pro — $29/month (HIGHLIGHTED)
- Badge: `Most Popular`
- `For creators and researchers.`
- 500 chat messages/month
- 60 min TTS/month
- 10 podcast episodes/month
- 1,000 pages indexed/month
- BYOK support
- Priority support
- **CTA:** `Upgrade to Pro` (primary/gradient button)

### Enterprise — $99/month
- `For teams that run on output.`
- 2,000 chat messages/month
- 300 min TTS/month
- 50 podcast episodes/month
- 10,000 pages indexed/month
- API access
- Dedicated support
- **CTA:** `Contact Sales` (outline button)

**Footnote** (small, centered, muted text): `Need more? Top up usage instantly — or use your own keys.`

---

## SECTION 12: FAQ

**Section heading:** `Questions, answered.`

**Layout:** Accordion style (shadcn Accordion component), centered, max-width ~800px.

1. **Do I need API keys to start?**
   No. You can start with Audioprism-managed AI immediately. If you want lower costs or full control, bring your own keys anytime.

2. **What can I upload?**
   PDFs, web pages, and common audio/video formats. Audioprism extracts content, builds notes, and indexes everything for search.

3. **What's included in the Free plan?**
   A small daily chat limit, a monthly indexing limit, and a single notebook — enough to test the workflow end-to-end.

4. **What happens when I hit my limits?**
   You'll get a friendly stop screen. You can upgrade, buy a top-up, or enable BYOK to keep going.

5. **Can I export audio?**
   Yes — generate episodes and export audio for listening anywhere.

6. **Is my data private?**
   Your notebooks are scoped to your account. If you store provider keys, they're encrypted at rest.

---

## SECTION 13: Community

**Section heading:** `Join the community`
**Section subheading:** `Feature drops, bug fixes, and the roadmap — without the corporate theatre.`

**Layout:** Two buttons, centered:
- `Join Discord` (Discord icon, outline button)
- `Star on GitHub` (GitHub icon, outline button)

---

## SECTION 14: Footer CTA (full-width banner)

**Layout:** A large, centered section with gradient background glow.

- Headline: `Ready to turn your research into audio?`
- Button: `Get Started Free` (large primary button)
- Small print: `No setup required. Bring your own keys anytime.`

---

## SECTION 15: Footer

**Layout:** Multi-column footer.

- Left: Audioprism logo + tagline: `Upload → Notes → Search → Podcast`
- Columns:
  - Product: Features, Pricing, Changelog
  - Resources: Docs, Blog, Community
  - Legal: Privacy, Terms
- Bottom row: `© 2026 Audioprism. All rights reserved.` + small text: `Bring your own keys anytime. Usage limits apply on managed AI.`

---

## Additional Requirements

- All "Get Started" and "Sign Up" buttons should link to `/sign-up`
- All "Sign In" links should go to `/sign-in`
- The page should be a single React Server Component (or mixed with client components where animation is needed)
- Use semantic HTML (`<header>`, `<main>`, `<section>`, `<footer>`)
- Add `id` attributes to each section for smooth-scroll anchor links from the nav (e.g., `id="features"`, `id="pricing"`, `id="community"`)
- Smooth scroll behavior on the page
- All images/logos can be placeholder divs with text for now
- The entire page should feel premium, fast, and polished — like Linear's or Vercel's homepage
