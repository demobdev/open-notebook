# Audioprism Usage Billing Spec (Model B)
**Model:** Subscription + Fair-Use + Overage (with optional BYOK)

This document defines how Audioprism meters expensive features (chat, TTS, podcast generation, embeddings), enforces plan limits, supports BYOK (Bring Your Own Keys), and bills overages using add-on bundles or metered charges.

---

## Goals
- Keep pricing *simple to understand* (no “credit store” vibe).
- Protect margin and infrastructure from heavy users (“whales”).
- Support two modes:
  - **Audioprism Keys (metered)**: we pay providers → we enforce fair-use + charge overage.
  - **BYOK (bring your own OpenAI/ElevenLabs keys)**: user pays provider → we enforce platform abuse limits only.
- Make billing disputes easy with an immutable usage ledger.

---

## Product Rules (High-Level)

### Billing Modes
1. **Audioprism Keys Mode**
   - Included monthly allowances apply.
   - When included usage is exhausted → user must buy add-ons or upgrade.

2. **BYOK Mode**
   - User provides their own provider keys (OpenAI, ElevenLabs).
   - Usage typically **does not count** against included allowances (recommended).
   - We still enforce:
     - request rate limits
     - job concurrency limits
     - max payload size limits
     - abuse detection

> UX: BYOK should feel like the “cheapest route” without being second-class.

---

## Plans & Included Allowances (Initial Recommendation)

### Free
- Chat: small daily cap (example: 20 msgs/day) or monthly cap (example: 100/mo)
- TTS: minimal or none
- Podcast: none
- Embeddings/Indexing: minimal (example: 100 pages/mo)
- BYOK: allowed (optional decision), but still enforce platform limits

### Pro ($29/mo)
- Chat: **500 messages / month**
- TTS: **60 minutes / month**
- Podcast: **10 episodes / month** (with constraints below)
- Embeddings/Indexing: **1,000 pages / month**

### Enterprise ($99/mo)
- Chat: 2,000 messages / month (or “unlimited” with guardrails)
- TTS: 300 minutes / month
- Podcast: 50 episodes / month
- Embeddings: 10,000 pages / month
- API access (optional)

> NOTE: These numbers are placeholders and can be tuned after observing real provider costs.

---

## Feature Units (What We Meter)

### Chat
- **Unit:** 1 message = 1 unit
- Optional future weighting by model:
  - gpt-4.1 messages cost more than small models, but keep this hidden from users initially.

### TTS
- **Preferred Unit:** 1 minute generated audio = 1 unit
- Alternate unit (if needed): 1,000 characters = 1 unit (less user-friendly, easier to estimate pre-run)

### Podcast Generation
- **Unit:** 1 episode = 1 unit  
- Must include strict constraints to prevent abuse and unexpected costs.

### Embeddings / Indexing
- **Unit:** 1 page indexed = 1 unit  
- Alternative: 1,000 tokens indexed = 1 unit (more accurate, more complex)

---

## Podcast Constraints (Non-Negotiable)
Without these, “10 episodes” becomes “10 feature-length documentaries.”

Recommended constraints per episode (included):
- **Max audio length:** 8 minutes (Pro) / 15 minutes (Enterprise)
- **Max sources per episode:** 5 (Pro) / 25 (Enterprise)
- **Max segments/chunks:** e.g., 10 segments
- **Max regeneration attempts included:** 2
- **Concurrency:** max 1 episode job at a time (Pro); max 3 (Enterprise)

If user requests beyond constraints:
- treat as **multiple episodes** (e.g., every 8 minutes = 1 episode unit), OR
- block with upgrade/add-on prompt

---

## Overage Billing Approach (Recommended)
Avoid raw pennies-per-unit early. Use **add-on bundles**.

### Add-On Bundles (Example)
- Chat Pack: **$5** → +500 messages
- TTS Pack: **$5** → +60 minutes
- Podcast Pack: **$10** → +10 episodes (or $1/episode)
- Index Pack: **$5** → +1,000 pages indexed

> Stripe implementation: sell these as one-time purchases (top-ups), or as subscription add-ons.

---

## Enforcement Philosophy
- **Soft stop:** If a job is already running, let it finish, then enforce limits on the next request.
- **Hard stop:** Only when the user attempts a new job and has insufficient allowance/add-on balance.

No one should get cut off mid-generation unless they’re obviously abusing.

---

## Data Model (SurrealDB)

### 1) `entitlements` (Current State Snapshot)
Tracks remaining allowances and add-ons for the current period.

**Key fields**
- `id`: `entitlements:{user_id}:{YYYY-MM}`
- `user_id`: string
- `plan`: `free|pro|enterprise`
- `period`: `YYYY-MM`
- `reset_at`: datetime
- `included_remaining`: object/map  
  - `chat_messages`
  - `tts_minutes`
  - `podcast_episodes`
  - `index_pages`
- `addon_remaining`: object/map OR cents balance
  - same keys as included (recommended)
- `updated_at`

> Use a period key so monthly reset is trivial: new row each month.

### 2) `usage_ledger` (Append-Only Immutable Ledger)
Every billable action writes a row.

**Key fields**
- `id`: `usage_ledger:{uuid}`
- `user_id`: string
- `period`: `YYYY-MM`
- `feature`: `chat|tts|podcast|index`
- `units`: number
- `cost_center`: `audioprism|byok`
- `request_id`: string (for debugging + idempotency)
- `metadata`: object (optional: model name, minutes, chars, notebook_id, etc.)
- `created_at`: datetime

### 3) `user_keys` (Encrypted Provider Keys)
- `id`: `user_keys:{user_id}:{provider}`
- `user_id`
- `provider`: `openai|elevenlabs`
- `encrypted_key`
- `enabled`: boolean
- `created_at`, `updated_at`

> IMPORTANT: Store encrypted. Never return full keys to client.

---

## Backend Request Flow (Decision Tree)

### Step 0: Identify user
- Clerk JWT → `request.state.user_id`

### Step 1: Determine cost center
- If user has BYOK enabled for this provider:
  - `cost_center = byok`
- Else:
  - `cost_center = audioprism`

### Step 2: Estimate units (pre-check)
- Chat: 1 message
- TTS: estimate minutes from text length OR treat as 1 unit minimum and reconcile later
- Podcast: 1 episode request (or more if length > cap)
- Index: pages estimated from parsed doc

### Step 3: Check entitlements (only if cost_center=audioprism)
- Read `entitlements:{user_id}:{period}`
- If `included_remaining[feature] >= units` → allow
- Else if `addon_remaining[feature] >= units` → allow (and decrement)
- Else → deny with **402 Payment Required** payload

### Step 4: Execute job
- Run model/TTS/index job

### Step 5: Reconcile actual usage (post)
- If actual units differ from estimate:
  - adjust ledger units to actual
  - adjust entitlements (careful: don’t go negative silently—prefer conservative estimate pre-run)

### Step 6: Write ledger row
- Always write `usage_ledger` row, even for BYOK (for analytics), but mark `cost_center=byok`.

---

## API Error Contract (402 Payment Required)
When blocking due to exhausted included + add-on usage:

**HTTP**
- Status: `402`

**Response JSON**
```json
{
  "error": "usage_limit_exceeded",
  "feature": "tts",
  "required_units": 12,
  "included_remaining": 0,
  "addon_remaining": 0,
  "period": "2026-02",
  "actions": [
    { "type": "buy_addon", "addon": "tts_pack" },
    { "type": "upgrade_plan", "plan": "enterprise" },
    { "type": "enable_byok", "provider": "elevenlabs" }
  ]
}
```

---

## New User Key Provisioning Flow

When a new user signs up, they should NOT see the existing "Migrate from env" banner or any raw API key management. Instead:

### "Use Our Keys" (Internal / Default Path)
1. User signs up → picks a plan (Free / Pro / Enterprise)
2. System automatically provisions access to Audioprism's house keys (OPENAI_API_KEY, ELEVENLABS_API_KEY, etc. stored in Railway env vars)
3. User lands in the app ready to go — no key setup, no migration prompts
4. Usage is metered against their plan allowances
5. The Settings/Models page shows pre-configured models with an "Audioprism Managed" badge
6. User never sees or touches an API key

### "Bring Your Own Keys" (BYOK Path)
1. User goes to Settings → API Keys
2. Clicks "Add Your Own Key" for a specific provider (OpenAI, ElevenLabs, etc.)
3. Key is encrypted and stored per-user in SurrealDB (`user_keys` table)
4. Usage for that provider switches to `cost_center=byok` — no metering against plan
5. User can mix: e.g., use their own OpenAI key but Audioprism's ElevenLabs key

### Switching Between Modes
- Users can switch from internal → BYOK at any time by adding their own key
- Users can switch from BYOK → internal by removing their key (usage resumes metering)
- God Mode admins bypass all metering regardless of which keys are used

### UX Notes
- Hide the legacy "Migrate from env" banner for new SaaS users entirely
- The current migration flow only applies to self-hosted / admin users
- For SaaS users, the API Keys page should show a clean "Your Providers" view with toggle between "Audioprism Managed" and "Your Own Key"