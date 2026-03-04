"""
Text utilities for Open Notebook.
Extracted from main utils to avoid circular imports.
"""

import re
import unicodedata
from typing import Tuple

# Patterns for matching thinking content in AI responses
# Standard pattern: <think>...</think>
THINK_PATTERN = re.compile(r"<think>(.*?)</think>", re.DOTALL)
# Pattern for malformed output: content</think> (missing opening tag)
THINK_PATTERN_NO_OPEN = re.compile(r"^(.*?)</think>", re.DOTALL)


def remove_non_ascii(text: str) -> str:
    """Remove non-ASCII characters from text."""
    return re.sub(r"[^\x00-\x7F]+", "", text)


def remove_non_printable(text: str) -> str:
    """Remove non-printable characters from text."""
    # Replace any special Unicode whitespace characters with a regular space
    text = re.sub(r"[\u2000-\u200B\u202F\u205F\u3000]", " ", text)

    # Replace unusual line terminators with a single newline
    text = re.sub(r"[\u2028\u2029\r]", "\n", text)

    # Remove control characters, except newlines and tabs
    text = "".join(
        char for char in text if unicodedata.category(char)[0] != "C" or char in "\n\t"
    )

    # Replace non-breaking spaces with regular spaces
    text = text.replace("\xa0", " ").strip()

    # Keep letters (including accented ones), numbers, spaces, newlines, tabs, and basic punctuation
    return re.sub(r"[^\w\s.,!?\-\n\t]", "", text, flags=re.UNICODE)


def parse_thinking_content(content: str) -> Tuple[str, str]:
    """
    Parse message content to extract thinking content from <think> tags.

    Handles both well-formed tags and malformed output where the opening
    <think> tag is missing but </think> is present.

    Args:
        content (str): The original message content

    Returns:
        Tuple[str, str]: (thinking_content, cleaned_content)
            - thinking_content: Content from within <think> tags
            - cleaned_content: Original content with <think> blocks removed

    Example:
        >>> content = "<think>Let me analyze this</think>Here's my answer"
        >>> thinking, cleaned = parse_thinking_content(content)
        >>> print(thinking)
        "Let me analyze this"
        >>> print(cleaned)
        "Here's my answer"
    """
    # Input validation
    if not isinstance(content, str):
        return "", str(content) if content is not None else ""

    # Limit processing for very large content (100KB limit)
    if len(content) > 100000:
        return "", content

    # Find all well-formed thinking blocks
    thinking_matches = THINK_PATTERN.findall(content)

    if thinking_matches:
        # Join all thinking content with double newlines
        thinking_content = "\n\n".join(match.strip() for match in thinking_matches)

        # Remove all <think>...</think> blocks from the original content
        cleaned_content = THINK_PATTERN.sub("", content)

        # Clean up extra whitespace
        cleaned_content = re.sub(r"\n\s*\n\s*\n", "\n\n", cleaned_content).strip()

        return thinking_content, cleaned_content

    # Handle malformed output: content</think> (missing opening tag)
    # Some models like Nemotron output thinking without the opening <think> tag
    malformed_match = THINK_PATTERN_NO_OPEN.match(content)
    if malformed_match:
        thinking_content = malformed_match.group(1).strip()
        # Remove the thinking content and </think> tag
        cleaned_content = content[malformed_match.end() :].strip()
        return thinking_content, cleaned_content

    return "", content


def clean_thinking_content(content: str) -> str:
    """
    Remove thinking content from AI responses, returning only the cleaned content.

    This is a convenience function for cases where you only need the cleaned
    content and don't need access to the thinking process.

    Args:
        content (str): The original message content with potential <think> tags

    Returns:
        str: Content with <think> blocks removed and whitespace cleaned

    Example:
        >>> content = "<think>Let me think...</think>Here's the answer"
        >>> clean_thinking_content(content)
        "Here's the answer"
    """
    _, cleaned_content = parse_thinking_content(content)
    return cleaned_content


# Match ```json or ``` followed by optional newline and content until closing ```
_CODE_BLOCK_PATTERN = re.compile(r"```(?:json)?\s*\n?(.*?)```", re.DOTALL)


def extract_json_from_model_output(content: str) -> str:
    """
    Prepare LLM output for JSON parsing: strip <think> blocks and optional markdown code fences.
    Also handles common model mistakes where the root object wrapper is missing.

    Use this before passing model output to a JSON/Pydantic parser to avoid
    "Invalid json output" when the model wraps JSON in <think> or in ```json ... ```.

    Args:
        content: Raw string from the LLM (may include <think> or code blocks).

    Returns:
        String suitable for JSON parsing (thinking removed, code block unwrapped).
    """
    import json

    if not isinstance(content, str) or not content.strip():
        return content if isinstance(content, str) else ""

    _, cleaned = parse_thinking_content(content)
    cleaned = cleaned.strip()

    # 1. Extract from code block if present
    match = _CODE_BLOCK_PATTERN.search(cleaned)
    if match:
        json_str = match.group(1).strip()
    else:
        json_str = cleaned

    # 2. Heuristic Fixups for common model "helpfulness" errors
    # (e.g. returning [item, item] instead of {"segments": [item, item]})
    try:
        data = json.loads(json_str)

        # Fixup: List returned instead of object with "segments" or "transcript"
        if isinstance(data, list) and len(data) > 0:
            first_item = data[0]
            if isinstance(first_item, dict):
                # Is it an outline?
                if all(k in first_item for k in ["name", "description", "size"]):
                    return json.dumps({"segments": data})
                # Is it a transcript?
                if all(k in first_item for k in ["speaker", "dialogue"]):
                    return json.dumps({"transcript": data})

        # Fixup: Single segment object returned instead of Outline
        if isinstance(data, dict):
            # If it has segment fields but NO "segments" key, wrap it
            if (
                all(k in data for k in ["name", "description", "size"])
                and "segments" not in data
            ):
                return json.dumps({"segments": [data]})
            # If it has dialogue fields but NO "transcript" key, wrap it
            if (
                all(k in data for k in ["speaker", "dialogue"])
                and "transcript" not in data
            ):
                return json.dumps({"transcript": [data]})

    except Exception:
        # If parsing fails here, just return the original string and let the
        # actual parser downstream handle the error with its own logic.
        pass

    return json_str


def extract_text_content(content) -> str:
    """Extract text from LLM response content.

    Handles both plain string responses and structured content formats
    (e.g. Gemini's envelope format):
    [{'type': 'text', 'text': '...', 'extras': {...}}]

    Args:
        content: The content from an AI message, either a string or a list of parts.

    Returns:
        The extracted text content as a string.
    """
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        text_parts = []
        for part in content:
            if isinstance(part, dict) and "text" in part:
                text_parts.append(part["text"])
            elif isinstance(part, str):
                text_parts.append(part)
        return "".join(text_parts)
    return str(content)
