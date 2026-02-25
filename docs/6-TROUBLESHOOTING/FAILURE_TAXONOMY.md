# Failure Taxonomy & Production Hardening

A structured map of failure points, error patterns, and hardening recommendations for production SaaS.

---

## 1. Failure Point Map

### Podcast Generation Pipeline

```
User clicks Generate
    → API: submit_generation_job()
        → Validate profiles exist ✓
        → Validate config (episode + speaker match) ✓
        → Submit to surreal-commands queue ✓
    → Worker picks up command
        → podcast_commands.generate_podcast_command()
            → Load episode_profile, speaker_profile ✓
            → Provision API keys (OpenAI, ElevenLabs) ✓
            → Create episode record (DB) ✓
            → create_podcast() [podcast-creator library]
                → OUTLINE  ← LLM (episode_profile.outline_provider/model)
                → TRANSCRIPT ← LLM (episode_profile.transcript_provider/model)
                → TTS ← speaker_profile.tts_provider/model
            → Save audio, transcript, outline ✓
```

**Single failure point**: `create_podcast()` runs outline → transcript → TTS in one call. We don't get stage-specific errors from the library; errors are opaque.

### Other Pipelines

| Pipeline | Failure points | Error propagation |
|----------|----------------|-------------------|
| **Source ingest** | Content extraction, embedding, DB save | `source_commands` → `error_message` on command |
| **Embeddings** | Model call, chunking, DB | `embedding_commands` → retries, then fail |
| **Chat/Ask** | Model call, context build | API returns 5xx, frontend shows generic error |
| **Credentials** | Test connection, model discovery | Toast + HTTP status |

---

## 2. Error Pattern Classification

### Already Classified (error_classifier.py)

| Pattern | Type | User message |
|---------|------|--------------|
| `401`, `invalid api key`, `unauthorized` | AuthenticationError | Check API key in Settings |
| `429`, `rate limit`, `quota exceeded` | RateLimitError | Wait and retry |
| `model not found`, `does not exist` | ConfigurationError | Pass through |
| `not allowed to generate embeddings` | ConfigurationError | Change embedding model |
| `connecterror`, `timeout`, `connection refused` | NetworkError | Check network |
| `context length`, `token limit` | ExternalServiceError | Reduce content / bigger model |
| `413`, `payload too large` | ExternalServiceError | Reduce payload |
| `500`, `502`, `503`, `service unavailable` | ExternalServiceError | Retry later |

### Podcast-Specific (podcast_commands.py)

| Pattern | Likely stage | Cause |
|---------|--------------|-------|
| `invalid json output`, `expecting value` | Outline or Transcript | LLM put output in `<think>` tags (GPT-5 reasoning models) or malformed JSON |
| `quota`, `429`, `insufficient_quota`, `credits`, `402` | Any (Outline/Transcript/TTS) | API limit or billing |
| `invalid_api_key`, `401` | Any | Bad or expired key |
| `max_character_limit` | TTS | ElevenLabs character quota |
| Missing `ELEVENLABS_API_KEY` | Pre-flight | Key not provisioned |

### Credentials Service (credentials_service.py)

| Pattern | Action |
|---------|--------|
| `quota`, `quota_exceeded`, `insufficient`, `402`, `payment` | Specific message: ElevenLabs vs generic billing |

---

## 3. Failure Patterns by Stage (Inferred)

### Outline / Transcript (LLM)

- **Provider**: `episode_profile.outline_provider`, `transcript_provider` (e.g. openai, google, anthropic)
- **Model**: `episode_profile.outline_model`, `transcript_model`
- **Common failures**:
  - **429 / rate limit**: GPT-4, Claude Opus, Gemini high-tier have stricter limits
  - **insufficient_quota**: OpenAI paid tier exhausted
  - **invalid json / expecting value**: Reasoning models (o1, o3) or GPT-5 with `<think>` output
  - **Model not found**: New model (e.g. `gemini-2.5-flash`) not yet in provider SDK

### TTS (Text-to-Speech)

- **Provider**: `speaker_profile.tts_provider` (elevenlabs, openai)
- **Model**: `speaker_profile.tts_model`
- **Common failures**:
  - **429**: ElevenLabs free tier limit
  - **max_character_limit**: ElevenLabs character cap
  - **Invalid voice_id**: Voice removed or typo in speaker config
  - **401**: ElevenLabs/OpenAI key invalid

---

## 4. Model-Specific Known Issues

| Model | Issue | Mitigation |
|-------|-------|------------|
| **GPT-5.x, o1, o3** | Extended thinking → output in `<think>`, JSON parse fails | Use gpt-4o, gpt-4o-mini for outline/transcript |
| **gpt-5.2-codex** | Coding model, not for creative text | Don't use for podcast |
| **Gemini 2.5** | New model names; SDK/model discovery may lag | Verify model string in provider docs; may need credential update |
| **ElevenLabs free** | 429 on concurrent/burst | TTS_BATCH_SIZE=2; space out requests |

---

## 5. Isolation: When Does Failure Happen?

| Phase | Failure symptom | Where to look |
|-------|-----------------|---------------|
| **Before command runs** | Episode never appears in list | Worker not running; queue not processed |
| **Profile validation** | 404 on validate-config | Episode or speaker profile missing (local vs prod DB) |
| **Submit** | 400/500 on Generate click | Config validation, content empty |
| **Outline** | Fails with JSON/parse error | Wrong model (reasoning); rate limit on outline model |
| **Transcript** | Fails with 429/quota | Outline succeeded; transcript model hit limit |
| **TTS** | Fails with 429/char limit | Outline+transcript OK; ElevenLabs quota |
| **After success** | Episode shows, no audio | File path wrong; audio not written |

---

## 6. Hardening Recommendations

### A. Better Error Attribution

1. **Stage tagging**: If podcast-creator can be modified, wrap outline/transcript/TTS in try/except and re-raise with stage prefix: `"[OUTLINE] "`, `"[TRANSCRIPT] "`, `"[TTS] "`.
2. **Error enrichment**: In `podcast_commands.py`, before re-raising, append which models are used:  
   `"Models: outline={episode_profile.outline_model}, transcript={episode_profile.transcript_model}, tts={speaker_profile.tts_model}"`.

### B. Centralized Error Classification

1. **Use `classify_error()` in podcast_commands**: Currently podcast_commands has its own pattern matching. Unify with `open_notebook.utils.error_classifier.classify_error()` for consistency.
2. **Add Gemini-specific rules**: `"model not found"`, `"gemini"`, `"invalid model"` → ConfigurationError with hint to check model name.

### C. Observability

1. **Background Jobs UI** (done): Advanced → Background Jobs shows command status, error_message.
2. **Structured logging**: Ensure `logger.error` includes `episode_name`, `episode_profile`, `speaker_profile` for correlation.
3. **Health/preflight**: Optional endpoint that checks: DB, worker process, key provisioning for default providers.

### D. Retry & Degradation

1. **Podcast retry**: Currently `retry={"max_attempts": 1}`. For rate limits (429), consider `max_attempts=2` with backoff.
2. **Model fallback**: Episode profile could specify fallback models for outline/transcript (e.g. primary: gpt-4o, fallback: gpt-4o-mini).
3. **TTS batch size**: `TTS_BATCH_SIZE=2` for ElevenLabs to avoid burst 429s.

### E. Production Checklist

- [ ] `ADMIN_USER_IDS` set for God Mode in production
- [ ] Episode profiles use rate-limit-friendly models (gpt-4o-mini, gemini-2.5-flash) for outline/transcript
- [ ] Speaker profiles have valid voice_ids for TTS provider
- [ ] Worker (`surreal-commands-worker`) running and monitored
- [ ] API keys provisioned via Settings → Credentials (not just env vars for multi-tenant)
- [ ] Logs centralized (e.g. CloudWatch, Datadog) for failure analysis

---

## 7. Quick Reference: Error → Action

| Error contains | Likely cause | Action |
|----------------|--------------|--------|
| `429`, `rate limit` | Too many requests | Wait; switch to gpt-4o-mini for outline/transcript |
| `insufficient_quota` | Billing/credits | Check provider usage page; add credits |
| `invalid json`, `expecting value` | Wrong model | Use gpt-4o, gpt-4o-mini; avoid reasoning models |
| `model not found`, `does not exist` | Bad model name | Verify in provider docs; check Gemini 2.5 naming |
| `max_character_limit` | ElevenLabs | Reduce episode length; check quota |
| `invalid api key`, `401` | Auth | Re-create credential in Settings |
| `ELEVENLABS_API_KEY` not set | Key not provisioned | Add credential; ensure key_provider runs |
| Episode not in list | Command never ran | Check worker; check Background Jobs for job status |

---

## 8. Files Reference

| File | Purpose |
|------|---------|
| `open_notebook/utils/error_classifier.py` | Central error classification |
| `commands/podcast_commands.py` | Podcast error handling, pattern matching |
| `api/credentials_service.py` | Credential test, quota messaging |
| `open_notebook/podcasts/validation.py` | Config validation (episode + speaker) |
| `docs/6-TROUBLESHOOTING/quick-fixes.md` | User-facing quick fixes |
