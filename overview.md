# BioLight × Open Notebook — Overview (North Star)

## TL;DR
We are using **Open Notebook** as the self-hosted “knowledge + scripting + podcast generation” core for **BioLight.shop** so **Don Bailey** and **Mike Belkowski** can produce **3–4 podcast episodes/week** with minimal friction.  
We will **ingest BioLight + Energy Code content**, generate **show-ready scripts**, render **audio with their ElevenLabs cloned voices**, and output **publish-ready assets** (MP3 + metadata + show notes).  
Future social/content features come later — the first build is the **in-house podcast factory**.

---

## The Problem We’re Solving
Current workflow is clunky:
- LM Notebook generates content/audio
- Export / PDF / manual steps
- Then run through ElevenLabs
- Then publish

We want:
- A single system that holds BioLight knowledge, produces on-brand podcast scripts, renders audio using Mike/Don voice clones, and outputs everything needed to publish — **without export gymnastics**.

---

## Core Goal (MVP)
Build an internal system that can do:
1. **Ingest BioLight knowledge**
2. **Generate an episode (multi-speaker)**
3. **Render audio using ElevenLabs voice clones**
4. **Export publish-ready package** (MP3 + title/description/show notes + links/disclaimer)
5. (Optional in MVP) **Auto-upload/schedule** to hosting platform

---

## Actors & Context
- **BioLight.shop**: brand + products + blog + podcast pages.
- **Podcast**: *The Energy Code* (Mike hosts; Don frequently co-hosts).
- **Mike Belkowski**: owner/host voice + scientific storyteller.
- **Don Bailey**: CFO/operator voice + pragmatic translator; wants weekly production to be frictionless.
- **Voices**: Mike + Don voice clones already exist in **ElevenLabs**.

---

## Why Open Notebook is the Base
Open Notebook provides:
- Content ingestion (links, PDFs, YouTube, txt, etc.)
- AI notes + summarization + transformations
- A built-in **Podcast Generator** system (episodes + speakers + voices)
- Privacy/self-hosting + API for automation

We will treat Open Notebook as the “brain + factory floor.”
We will add a thin “publisher” layer later if needed.

---

## System Concept: “BioLight Podcast Factory”
### Input
A producer (usually Don) provides **one** of:
- Bullet outline / topic prompt
- Link dump (BioLight pages + studies + blog posts)
- A product/topic focus (“mitochondria-first stack”, “methylene blue”, etc.)
- Guest talking points (optional)

### Output
A complete publish-ready bundle:
- Episode title + alt titles
- Cold open + segment outline
- Two-speaker script (Mike + Don)
- Show notes w/ links
- Disclaimer block (health/wellness safe)
- MP3 audio (ElevenLabs voices)
- Metadata JSON (duration, tags, timestamps if possible)

---

## Data Ingestion Strategy (Knowledge Base)
Create a dedicated notebook:
- **Notebook: BioLight Knowledge Base**

Ingest:
- Product pages (all flagship SKUs + collections)
- Podcast episode pages (show notes, summaries, timestamps when present)
- BioLight blog/learn articles
- Internal docs: product positioning, FAQs, protocols, “do not claim” rules
- Brand voice rules: tone, words to avoid, disclaimers, audience profile

### Key Principle
All generation should cite/anchor to this knowledge base to stay:
- Accurate
- On-brand
- Consistent in claims and language

---

## Voice + Style: Speaker Profiles
We maintain two “Speaker Profiles” (canonical, reused everywhere):
### Speaker: Mike
- Role: host / educator / scientific storyteller
- Style: confident, curious, structured, myth-busting
- Output: frames the topic, teaches, makes it memorable

### Speaker: Don
- Role: operator / CFO / practical translator
- Style: concise, grounded, implementation-focused
- Output: asks real-world questions, clarifies, adds business/practice perspective

We also define one “Episode Profile”:
- Format: 2 speakers
- Structure: Hook → 2–4 teaching blocks → actionable takeaways → soft CTA
- Guardrails: avoid risky medical claims; always include disclaimer

---

## Guardrails (Non-Negotiable)
BioLight content lives near health claims. We must:
- Bake in a consistent disclaimer block
- Maintain a “Do Not Claim” list
- Prefer phrasing like: “may support”, “emerging evidence suggests”, “talk to your clinician”, etc.
- Avoid diagnosis/treatment promises
- Avoid implying FDA approval unless explicitly true

These guardrails must be applied:
- In script generation
- In show notes generation
- In any derivative content later

---

## MVP Feature List (Build Order)
### Phase A — Platform + Knowledge
- Self-host Open Notebook
- Secure it (auth + keys)
- Create BioLight Knowledge Base notebook
- Ingest initial sources (products + recent podcast episodes + top blog content)

### Phase B — Episode Generator
- Create Mike + Don Speaker Profiles
- Create “Energy Code” Episode Profile template
- Implement transformations:
  - Episode titles
  - Outline
  - Full script
  - Show notes + links
  - Disclaimer block (always)

### Phase C — Audio Rendering
- Use ElevenLabs API with:
  - Mike voice ID
  - Don voice ID
- Render script → MP3
- Output MP3 + metadata bundle

### Phase D (Optional in MVP) — Publish Assist
- Export a ready-to-upload package
- (Later) Direct upload/scheduling integration to hosting platform

---

## What Success Looks Like (MVP)
Don can produce an episode with:
- < 10 minutes of input work
- Mostly one-click automation after providing topic/links
- Consistent Mike/Don voice + format
- Publish-ready outputs with minimal edits

Target throughput:
- 3–4 episodes per week reliably

---

## Architectural Notes
- Open Notebook is the “system of record” for knowledge and generation.
- We automate via Open Notebook’s API (create sources, trigger transforms, trigger podcast generation, poll job status).
- ElevenLabs is only the rendering engine for the voices (TTS output).
- Publishing is a separate module; don’t block MVP on it.

---

## Future Extensions (Not MVP)
We intentionally defer:
- Social media clip generation (shorts, reels, TikTok scripts)
- Auto-generated carousels + newsletters
- Auto-cut video avatars / facecam compositing
- Full distribution automation across platforms

Those will be layered on after the podcast factory is stable.

---

## Open Questions (Track, Don’t Block MVP)
- Where do we host the final MP3s in v1 (manual upload vs API)?
- Do we need per-episode approvals/versioning?
- Do we need transcripts auto-published on BioLight.shop?
- How strict should topic gating be (avoid sensitive medical claims)?

---

## Immediate Next Steps
1. Stand up Open Notebook locally (docker compose).
2. Create the BioLight Knowledge Base notebook.
3. Ingest: top products + last ~20 podcast pages + highest-performing blog posts.
4. Implement speaker profiles + “Energy Code” episode profile.
5. Wire ElevenLabs voice IDs + generate first internal test episode.
6. Iterate until output needs minimal edits.

---