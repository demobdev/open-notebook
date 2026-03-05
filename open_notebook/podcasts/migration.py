from loguru import logger

from open_notebook.database.repository import repo_query
from open_notebook.ai.models import Model
from open_notebook.podcasts.models import EpisodeProfile, SpeakerProfile


async def migrate_podcast_profiles():
    """
    Migrate legacy podcast profiles (string-based providers/models)
    to the new Model Registry references.
    """
    logger.info("Starting podcast profile data migration...")

    # 1. Fetch all models from registry to build a lookup map
    models = await Model.get_all()
    # Map: (provider, name) -> model_id
    model_map = {(m.provider, m.name): str(m.id) for m in models}

    # 2. Migrate Episode Profiles
    episode_profiles = await EpisodeProfile.get_all()
    ep_migrated = 0

    for ep in episode_profiles:
        # Check if already migrated
        if ep.outline_llm and ep.transcript_llm:
            continue

        changed = False

        # Migrate outline model
        if not ep.outline_llm and ep.outline_provider and ep.outline_model:
            key = (ep.outline_provider, ep.outline_model)
            if key in model_map:
                ep.outline_llm = model_map[key]
                changed = True

        # Migrate transcript model
        if not ep.transcript_llm and ep.transcript_provider and ep.transcript_model:
            key = (ep.transcript_provider, ep.transcript_model)
            if key in model_map:
                ep.transcript_llm = model_map[key]
                changed = True

        # Set default language if missing
        if not ep.language:
            ep.language = "en-US"
            changed = True

        if changed:
            await ep.save()
            ep_migrated += 1

    # 3. Migrate Speaker Profiles
    speaker_profiles = await SpeakerProfile.get_all()
    sp_migrated = 0

    for sp in speaker_profiles:
        # Check if already migrated
        if sp.voice_model:
            continue

        changed = False

        # Migrate tts model
        if not sp.voice_model and sp.tts_provider and sp.tts_model:
            key = (sp.tts_provider, sp.tts_model)
            if key in model_map:
                sp.voice_model = model_map[key]
                changed = True

        if changed:
            await sp.save()
            sp_migrated += 1

    if ep_migrated > 0 or sp_migrated > 0:
        logger.success(
            f"Migrated {ep_migrated} episode profiles and {sp_migrated} speaker profiles"
        )
    else:
        logger.info("No podcast profiles needed migration")
