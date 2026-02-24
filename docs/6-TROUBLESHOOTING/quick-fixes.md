# Quick Fixes - Top 11 Issues & Solutions

Common problems with 1-minute solutions.

---

## #0: Clerk "Missing environment keys" or "auth() was called but Clerk can't detect clerkMiddleware()"

**Symptom:** Error page shows "Missing environment keys" and/or "Clerk: auth() was called but Clerk can't detect usage of clerkMiddleware()"

**Cause:** Clerk API keys not loaded by the frontend. Next.js 16 uses `proxy.ts` only (no `middleware.ts`); Clerk runs via `clerkMiddleware()` in `src/proxy.ts`.

**Solution (1 minute):**

1. **Set Clerk keys for the frontend**  
   When running the dev server from `frontend/` (`cd frontend && npm run dev`), Next.js loads env from `frontend/`, not the repo root. Add a `frontend/.env.local` with:
   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   ```
   Get the keys from [Clerk Dashboard](https://dashboard.clerk.com) → your application → API Keys.

2. **If you use a single root `.env.local`**  
   Either copy the Clerk variables above into `frontend/.env.local`, or run the frontend from the repo root so the root `.env.local` is in the same directory (e.g. `npm run dev --prefix frontend` from root).

3. **Restart the dev server** after changing env.

**If still broken:**  
- Confirm `src/proxy.ts` exists and uses `clerkMiddleware()` (Next.js 16 uses proxy only).  
- See [Clerk Next.js quickstart](https://clerk.com/docs/quickstarts/nextjs).

---

## #0a: Get Docker working ("command not found: docker")

**Symptom:** `zsh: command not found: docker` when running `docker compose` or `make database`.

**Cause:** Docker Desktop is installed but the `docker` CLI isn’t on your shell’s PATH (common if the terminal was opened before Docker was installed or restarted).

**Fix (pick one):**

1. **Use a new terminal**  
   Quit the terminal app and open a new window, or open a new tab. Then run:
   ```bash
   docker compose up -d surrealdb
   ```

2. **Add Docker to PATH in this shell**  
   Docker Desktop on Mac usually installs the CLI in `/usr/local/bin`. Run:
   ```bash
   export PATH="/usr/local/bin:$PATH"
   docker compose up -d surrealdb
   ```

3. **Make it permanent in zsh**  
   Add the same line to your shell config so every new terminal has `docker`:
   ```bash
   echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

4. **If Docker put the CLI elsewhere**  
   If you chose a custom install path (e.g. `~/.docker/bin`), use that in the `export` instead:
   ```bash
   export PATH="$HOME/.docker/bin:$PATH"
   ```

**Check:** Run `docker --version`. If that works, then `make database` or `docker compose up -d surrealdb` will work from the project root.

**Alternative (no PATH change):** From the project root you can use the helper script, which looks for Docker in common install locations:
   ```bash
   ./scripts/docker-compose.sh up -d surrealdb
   ```

---

## #0b: "command not found: docker" — Run without Docker

**Symptom:** `zsh: command not found: docker` when running `docker compose` or `make database`.

**Cause:** Docker isn't installed or isn't on your PATH (e.g. Docker Desktop not running).

**Option 1 — Fix Docker (if you use it)**  
- Install [Docker Desktop](https://docs.docker.com/desktop/install/) or add Docker to your PATH.  
- Then: `docker compose up -d surrealdb` and continue with API + frontend as usual.

**Option 2 — Run without Docker (SurrealDB binary)**  
Use a local SurrealDB server instead of Docker:

1. **Install SurrealDB** (macOS):
   ```bash
   brew install surrealdb/tap/surreal
   ```
   Or: `curl -sSf https://install.surrealdb.com | sh`

2. **Start SurrealDB** (in its own terminal; leave it running):
   ```bash
   mkdir -p surreal_data
   surreal start --log info --user root --pass root --bind 0.0.0.0:8000 file:./surreal_data/surreal.db
   ```

3. **Point the API at localhost** — in your project root `.env` or `.env.local` set:
   ```bash
   SURREAL_URL=ws://127.0.0.1:8000/rpc
   SURREAL_USER=root
   SURREAL_PASSWORD=root
   SURREAL_NAMESPACE=open_notebook
   SURREAL_DATABASE=open_notebook
   ```

4. **Start the app** (from project root):
   ```bash
   uv run run_api.py
   ```
   In another terminal: `uv run --env-file .env surreal-commands-worker --import-modules commands`  
   In a third: `cd frontend && npm run dev`

5. Open **http://localhost:3000** and **http://localhost:5055/docs**.

---

## #0c: OpenAI API failed / "insufficient_quota" / "Why do I owe money?"

**Symptom:** OpenAI requests fail with "insufficient_quota", 429, or a billing-related error. The app shows "Configured" (key loaded) but calls fail.

**Cause:** Your OpenAI key is valid but your **account has no remaining credits** or you've hit a usage limit. This is an **OpenAI account billing** issue, not an app bug.

**What to do:**

1. **Check usage and billing**
   - Open **https://platform.openai.com/usage** (log in with the account that owns the API key).
   - See how much you've used and whether you have credits or a paid subscription.

2. **Add payment or credits**
   - Go to **https://platform.openai.com/settings/organization/billing** (or the Billing section in your OpenAI account).
   - Add a payment method or buy credits so new requests can go through.

3. **"Owe money"**
   - If you have **usage-based billing**, you pay for what you use; past usage may show as owed until the next invoice.
   - If you see **insufficient_quota** or **429**, the account is out of credits or over limit until you add payment or wait for the limit to reset.

4. **In the app**
   - After fixing billing, try **Settings → API Keys → Test** on your OpenAI credential.
   - If tests pass, chat, embeddings, and podcast (outline/transcript/TTS when using OpenAI) should work again.

**References:** [OpenAI Usage](https://platform.openai.com/usage) · [OpenAI Billing](https://platform.openai.com/settings/organization/billing)

---

## #0d: "Pre-flight config validation is unavailable" / 404 on validate-config

**Symptom:** Generate Podcast dialog shows an orange warning "Pre-flight config validation is unavailable on this backend version" and the browser console may show `AxiosError: Request failed with status code 404` for `/podcasts/validate-config`.

**Cause:** The API you're hitting (e.g. the Docker container `open_notebook:local`) was built from an image that doesn't include the validate-config endpoint, or the API is an older version.

**What it means:** Validation is optional. You can still click **Generate**; if the episode or speaker profile is wrong, the backend will report that when you submit. The warning is informational.

**To get pre-flight validation (optional):** Run the API from source so it has the latest routes: from the project root run `uv run run_api.py` instead of using the Docker API container. Or rebuild the Docker image so it includes the current `api/routers/podcasts.py` (with `POST /api/podcasts/validate-config`).

---

## #0e: "No outline available" / "No transcript" in podcast Details

**Symptom:** A podcast episode appears in the list (or shows as completed) but in **Details** the Outline and Transcript tabs say "No outline available" / "No transcript".

**Cause:** The episode record was created when you started the job, but the **job failed** before outline/transcript were generated (e.g. "Invalid json output", API key error, or TTS failure). We only save outline and transcript when the full pipeline succeeds. So that episode row is from a failed run and was never updated with outline/transcript.

**What to do:**

1. **Check job status** — In the list, look at **Failed** count and **Completed**. Episodes that completed successfully will have outline and transcript; ones that failed won't.
2. **Retry with a working config** — Fix the underlying error (e.g. use gpt-4o or gpt-4o-mini for outline/transcript if you saw "Invalid json output"; set `GOOGLE_API_KEY` and recreate the container if you saw "Google API key not found"). Then **generate a new episode** (new name). The new run should save outline and transcript when it succeeds.
3. **Verify after a successful run** — Open **Details** on a **completed** episode; Outline and Transcript tabs should show content. If they don't, run the local test below.

**Local testing before push:** From project root run the podcast generation tests, then trigger one real generation and confirm in the UI that the new episode's Details show outline and transcript:

```bash
uv run pytest tests/test_podcast_generation.py -v
# Then generate one episode in the app and open Details → Outline / Transcript
```

---

## #1: "Cannot connect to server"

**Symptom:** Browser shows error "Cannot connect to server" or "Unable to reach API"

**Cause:** Frontend can't reach API

**Solution (1 minute):**

```bash
# Step 1: Check if API is running
docker ps | grep api

# Step 2: Verify port 5055 is accessible
curl http://localhost:5055/health

# Expected output: {"status":"ok"}

# If that doesn't work:
# Step 3: Restart services
docker compose restart

# Step 4: Try again
# Open http://localhost:8502 in browser
```

**If still broken:**
- Check `API_URL` in .env (should match your frontend URL)
- See [Connection Issues](connection-issues.md)

---

## #2: "Invalid API key" or "Models not showing"

**Symptom:** Settings → Models shows "No models available"

**Cause:** No credential configured, or credential has invalid API key

**Solution (1 minute):**

```
1. Go to Settings → API Keys
2. If no credential exists, click "Add Credential" and add one
3. If a credential exists, click "Test Connection"
4. If test fails, delete and re-create with correct key
5. After test passes, click "Discover Models" → "Register Models"
6. Go to Settings → Models to verify models appear
```

**If still broken:**
- Make sure key has no extra spaces
- Generate a fresh key from provider dashboard
- Check that `OPEN_NOTEBOOK_ENCRYPTION_KEY` is set in docker-compose.yml
- See [AI & Chat Issues](ai-chat-issues.md)

---

## #3: "Port X already in use"

**Symptom:** Docker error "Port 8502 is already allocated"

**Cause:** Another service using that port

**Solution (1 minute):**

```bash
# Option 1: Stop the other service
# Find what's using port 8502
lsof -i :8502
# Kill it or close the app

# Option 2: Use different port
# Edit docker-compose.yml
# Change: - "8502:8502"
# To:     - "8503:8502"

# Then restart
docker compose restart
# Access at: http://localhost:8503
```

---

## #4: "Cannot process file" or "Unsupported format"

**Symptom:** Upload fails or says "File format not supported"

**Cause:** File type not supported or too large

**Solution (1 minute):**

```bash
# Check if file format is supported:
# ✓ PDF, DOCX, PPTX, XLSX (documents)
# ✓ MP3, WAV, M4A (audio)
# ✓ MP4, AVI, MOV (video)
# ✓ URLs/web links

# ✗ Pure images (.jpg without OCR)
# ✗ Files > 100MB

# Try these:
# - Convert to PDF if possible
# - Split large files
# - Try uploading again
```

---

## #5: "Chat is very slow"

**Symptom:** Chat responses take minutes or timeout

**Cause:** Slow AI provider, large context, or overloaded system

**Solution (1 minute):**

```bash
# Step 1: Check which model you're using
# Settings → Models
# Note the model name

# Step 2: Try a cheaper/faster model
# OpenAI: Switch to gpt-4o-mini (10x cheaper, slightly faster)
# Anthropic: Switch to claude-3-5-haiku (fastest)
# Groq: Use any model (ultra-fast)

# Step 3: Reduce context
# Chat: Select fewer sources
# Use "Summary Only" instead of "Full Content"

# Step 4: Check if API is overloaded
docker stats
# Look at CPU/memory usage
```

For deep dive: See [AI & Chat Issues](ai-chat-issues.md)

---

## #6: "Chat gives bad responses"

**Symptom:** AI responses are generic, wrong, or irrelevant

**Cause:** Bad context, vague question, or wrong model

**Solution (1 minute):**

```bash
# Step 1: Make sure sources are in context
# Click "Select Sources" in Chat
# Verify relevant sources are checked and set to "Full Content"

# Step 2: Ask a specific question
# Bad: "What do you think?"
# Good: "Based on the paper's methodology section, what are the 3 main limitations?"

# Step 3: Try a more powerful model
# OpenAI: Use gpt-4o (better reasoning)
# Anthropic: Use claude-3-5-sonnet (best reasoning)

# Step 4: Check citations
# Click citations to verify AI actually saw those sources
```

For detailed help: See [Chat Effectively](../3-USER-GUIDE/chat-effectively.md)

---

## #7: "Search returns nothing"

**Symptom:** Search shows 0 results even though content exists

**Cause:** Wrong search type or poor query

**Solution (1 minute):**

```bash
# Try a different search type:

# If you searched with KEYWORDS:
# Try VECTOR SEARCH instead
# (Concept-based, not keyword-based)

# If you searched for CONCEPTS:
# Try TEXT SEARCH instead
# (Look for specific words in your query)

# Try simpler search:
# Instead of: "How do transformers work in neural networks?"
# Try: "transformers" or "neural networks"

# Check sources are processed:
# Go to notebook
# All sources should show green "Ready" status
```

For detailed help: See [Search Effectively](../3-USER-GUIDE/search.md)

---

## #8: "Podcast generation failed"

**Symptom:** "Podcast generation failed" error (often with "429" or "insufficient_quota" in the message)

**Cause:** Insufficient content, API quota, rate limiting, or network issue

**Solution (1 minute):**

```bash
# Step 1: Make sure you have content
# Select at least 1-2 sources
# Avoid single-sentence sources

# Step 2: If error says "429" or "insufficient_quota" (OpenAI)
# The outline/transcript step uses your episode profile's LLM.
# High-end models (Claude Opus, GPT-4) have lower rate limits.
# → Edit your Episode Profile (Templates tab) and set Outline Model
#   and Transcript Model to gpt-4o-mini or gpt-4o (higher limits).
# → Wait 1-2 minutes and retry.

# Step 3: Try again
# Sometimes it's a temporary API issue
# Wait 30 seconds and retry

# Step 4: Check your TTS provider has quota
# OpenAI: Check account has credits
# ElevenLabs: Check monthly quota
# Google: Check API quota

# Step 5: Try different TTS provider
# In podcast generation, choose "Google" or "Local"
# instead of "ElevenLabs"
```

For detailed help: See [FAQ](faq.md)

---

## #9: "Services won't start" or Docker error

**Symptom:** Docker error when running `docker compose up`

**Cause:** Corrupt configuration, permission issue, or resource issue

**Solution (1 minute):**

```bash
# Step 1: Check logs
docker compose logs

# Step 2: Try restart
docker compose restart

# Step 3: If that fails, rebuild
docker compose down
docker compose up --build

# Step 4: Check disk space
df -h
# Need at least 5GB free

# Step 5: Check Docker has enough memory
# Docker settings → Resources → Memory: 4GB+
```

---

## #10: "Database says 'too many connections'"

**Symptom:** Error about database connections

**Cause:** Too many concurrent operations

**Solution (1 minute):**

```bash
# In .env, reduce concurrency:
SURREAL_COMMANDS_MAX_TASKS=2

# Then restart:
docker compose restart

# This makes it slower but more stable
```

---

## #11: Slow Startup or Download Timeouts (China/Slow Networks)

**Symptom:** Container crashes on startup, worker enters FATAL state, or pip/uv downloads fail

**Cause:** Slow network or restricted access to Python package repositories

**Solution:**

### Increase Download Timeout
```yaml
# In docker-compose.yml environment:
environment:
  - UV_HTTP_TIMEOUT=600  # 10 minutes (default is 30s)
```

### Use Chinese Mirrors (if in China)
```yaml
environment:
  - UV_HTTP_TIMEOUT=600
  - UV_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple
  - PIP_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple
```

**Alternative Chinese mirrors:**
- Tsinghua: `https://pypi.tuna.tsinghua.edu.cn/simple`
- Aliyun: `https://mirrors.aliyun.com/pypi/simple/`
- Huawei: `https://repo.huaweicloud.com/repository/pypi/simple`

**Note:** First startup may take several minutes while dependencies download. Subsequent starts will be faster.

---

## Quick Troubleshooting Checklist

When something breaks:

- [ ] **Restart services:** `docker compose restart`
- [ ] **Check logs:** `docker compose logs`
- [ ] **Verify connectivity:** `curl http://localhost:5055/health`
- [ ] **Check .env:** API keys set? API_URL correct?
- [ ] **Check resources:** `docker stats` (CPU/memory)
- [ ] **Clear cache:** `docker system prune` (free space)
- [ ] **Rebuild if needed:** `docker compose up --build`

---

## Nuclear Options (Last Resort)

**Completely reset (will lose all data in Docker):**

```bash
docker compose down -v
docker compose up --build
```

**Reset to defaults:**
```bash
# Backup your .env first!
cp .env .env.backup

# Reset to example
cp .env.example .env

# Edit with your API keys
# Restart
docker compose up
```

---

## Prevention Tips

1. **Keep backups** — Export your notebooks regularly
2. **Monitor logs** — Check `docker compose logs` periodically
3. **Update regularly** — Pull latest image: `docker pull lfnovo/open_notebook:latest`
4. **Document changes** — Keep notes on what you configured
5. **Test after updates** — Verify everything works

---

## Still Stuck?

- **Look up your exact error** in [Troubleshooting Index](index.md)
- **Check the FAQ** in [FAQ](faq.md)
- **Check logs:** `docker compose logs | head -50`
- **Ask for help:** [Discord](https://discord.gg/37XJPXfz2w) or [GitHub Issues](https://github.com/lfnovo/open-notebook/issues)
