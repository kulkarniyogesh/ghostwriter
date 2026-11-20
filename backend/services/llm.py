"""
LLM client — all AI calls go through here.
Uses Groq (llama-3.3-70b) with Gemini as fallback.
"""
import os
import json
import asyncio
from groq import AsyncGroq
from models.schemas import SourceFile, MigratedFile
from services.prompts import build_migration_prompt, build_test_prompt, build_report_prompt

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = "openai/gpt-oss-120b"
MAX_RETRIES = 3


async def call_groq(system: str, user: str, temperature: float = 0.2, max_tokens: int = 4096) -> str:
    client = AsyncGroq(api_key=GROQ_API_KEY)
    for attempt in range(MAX_RETRIES):
        try:
            response = await client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": user},
                ],
                temperature=temperature,
                max_tokens=max_tokens,
                response_format={"type": "json_object"},
            )
            return response.choices[0].message.content
        except Exception as e:
            if attempt == MAX_RETRIES - 1:
                raise RuntimeError(f"LLM call failed after {MAX_RETRIES} attempts: {e}")
            await asyncio.sleep(2 ** attempt)


def parse_llm_json(raw: str) -> dict:
    """Parse LLM JSON response, with fallback cleaning."""
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        # Try to extract JSON block
        import re
        match = re.search(r'\{.*\}', raw, re.DOTALL)
        if match:
            return json.loads(match.group())
        raise ValueError("LLM returned non-JSON response")


async def migrate_file(source_file: SourceFile, target_language: str) -> MigratedFile:
    """Migrate a single legacy file to the target language."""
    system_prompt, user_prompt = build_migration_prompt(source_file, target_language)
    raw = await call_groq(system_prompt, user_prompt, temperature=0.2, max_tokens=4096)
    data = parse_llm_json(raw)

    # Determine new file path
    ext_map = {"python": ".py", "nodejs": ".js", "go": ".go"}
    import os
    new_ext = ext_map.get(target_language, ".py")
    original_stem = os.path.splitext(source_file.path)[0]
    new_path = f"src/{original_stem.lower().replace(' ', '_')}{new_ext}"

    return MigratedFile(
        path=new_path,
        original_path=source_file.path,
        migrated_code=data.get("migrated_code", "# Migration failed"),
        explanation=data.get("explanation", ""),
        changes=data.get("changes", []),
        warnings=data.get("warnings", []),
        confidence=int(data.get("confidence", 0)),
        confidence_reason=data.get("confidence_reason", ""),
    )


async def generate_tests(migrated: MigratedFile, target_language: str) -> str:
    """Generate unit tests for a migrated file."""
    system_prompt, user_prompt = build_test_prompt(migrated, target_language)
    raw = await call_groq(system_prompt, user_prompt, temperature=0.3, max_tokens=2048)
    data = parse_llm_json(raw)
    return data.get("test_code", "# No tests generated")


async def generate_autopsy_report(migrated_files: list[MigratedFile], source_language: str) -> str:
    """Generate a plain-English autopsy report for the entire migration."""
    system_prompt, user_prompt = build_report_prompt(migrated_files, source_language)
    raw = await call_groq(system_prompt, user_prompt, temperature=0.7, max_tokens=2048)
    data = parse_llm_json(raw)
    return data.get("report", "Migration complete.")
