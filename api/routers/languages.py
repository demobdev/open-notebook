from typing import List

import pycountry
from babel import Locale
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class Language(BaseModel):
    code: str
    name: str


@router.get("/languages", response_model=List[Language])
async def list_languages():
    """List supported BCP 47 language codes with localized names"""
    languages = []
    # Common broadcast/podcast languages
    codes = [
        "en-US",
        "en-GB",
        "pt-BR",
        "pt-PT",
        "es-ES",
        "es-MX",
        "fr-FR",
        "de-DE",
        "it-IT",
        "ja-JP",
        "ko-KR",
        "zh-CN",
        "zh-TW",
        "ru-RU",
    ]

    for code in codes:
        try:
            # BCP 47 uses hyphens, Babel often expects underscores for some operations
            # but Locale.parse handles hyphens fine in modern versions.
            locale = Locale.parse(code)
            languages.append(
                Language(code=code, name=locale.get_display_name("en_US").title())
            )
        except Exception:
            continue

    return sorted(languages, key=lambda x: x.name)
