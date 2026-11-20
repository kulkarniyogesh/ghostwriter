"""
LLM prompt builders — all prompts for migration, tests, and reports.
Temperature 0.2 for code (deterministic), 0.7 for prose.
"""
from models.schemas import SourceFile, MigratedFile

LANGUAGE_PERSONAS = {
    "COBOL": "You are an expert COBOL engineer with 30 years of enterprise mainframe experience and deep knowledge of modern Python.",
    "Pascal": "You are an expert Pascal/Delphi engineer with deep knowledge of modern Python.",
    "VB6": "You are an expert Visual Basic 6 engineer with deep knowledge of modern Python.",
    "Fortran": "You are an expert Fortran scientific computing engineer with deep knowledge of modern Python.",
    "Perl": "You are an expert Perl CGI engineer with deep knowledge of modern Python.",
    "ActionScript": "You are an expert ActionScript/Flash engineer with deep knowledge of modern JavaScript.",
    "ClassicASP": "You are an expert Classic ASP engineer with deep knowledge of modern Python web frameworks.",
    "PHP": "You are an expert legacy PHP engineer with deep knowledge of modern Python.",
}

DEFAULT_PERSONA = "You are an expert legacy code migration engineer with deep knowledge of modern Python."

TARGET_LANGUAGE_NAMES = {
    "python": "Python 3.12",
    "nodejs": "Node.js 22 (ESM)",
    "go": "Go 1.23",
}


def build_migration_prompt(source_file: SourceFile, target_language: str) -> tuple[str, str]:
    persona = LANGUAGE_PERSONAS.get(source_file.language, DEFAULT_PERSONA)
    target_name = TARGET_LANGUAGE_NAMES.get(target_language, "Python 3.12")
    year = source_file.estimated_year or "unknown era"

    system = f"""{persona}
You produce clean, idiomatic, production-quality {target_name}.
You ALWAYS respond with valid JSON only — no markdown, no explanation outside JSON."""

    user = f"""Migrate this {source_file.language} code (circa {year}) to modern {target_name}.

FILE: {source_file.path}
---
{source_file.content[:8000]}
---

Respond with this exact JSON structure:
{{
  "migrated_code": "complete migrated code as a string",
  "explanation": "2-3 sentence plain English description of what this code does",
  "changes": ["Change 1 and why", "Change 2 and why", "..."],
  "warnings": ["WARNING: description of anything that could not be fully migrated"],
  "confidence": 94,
  "confidence_reason": "One sentence explaining the confidence score"
}}

Rules:
- migrated_code must be complete, runnable {target_name}
- Add inline comments for non-obvious logic
- Use type hints (Python) or JSDoc (Node.js)
- Replace platform-specific I/O with modern equivalents
- If you cannot migrate something, add a # WARNING: comment in the code AND add it to warnings array
- confidence is 0-100; deduct 15 for unmapped platform calls, 5 for approximated logic, 2 for missing docs"""

    return system, user


def build_test_prompt(migrated: MigratedFile, target_language: str) -> tuple[str, str]:
    target_name = TARGET_LANGUAGE_NAMES.get(target_language, "Python 3.12")
    test_framework = {"python": "pytest", "nodejs": "Jest", "go": "testing"}.get(target_language, "pytest")

    system = f"""You are a senior {target_name} engineer expert in {test_framework}.
You ALWAYS respond with valid JSON only."""

    user = f"""Write unit tests for this {target_name} code using {test_framework}.

CODE:
---
{migrated.migrated_code[:4000]}
---

Respond with:
{{
  "test_code": "complete test file as a string with at least 3 test cases"
}}

Rules:
- Cover happy path, edge cases, and error cases
- Use descriptive test names
- Tests must be runnable without modification"""

    return system, user


def build_report_prompt(migrated_files: list[MigratedFile], source_language: str) -> tuple[str, str]:
    file_summaries = "\n".join(
        f"- {f.original_path}: {f.explanation} (confidence: {f.confidence}%)"
        for f in migrated_files[:10]
    )
    all_warnings = [w for f in migrated_files for w in f.warnings]

    system = """You are a technical writer producing a migration autopsy report.
Write in clear, plain English. Be specific and honest.
You ALWAYS respond with valid JSON only."""

    user = f"""Write a migration autopsy report for this {source_language} codebase migration.

FILES MIGRATED:
{file_summaries}

WARNINGS ({len(all_warnings)} total):
{chr(10).join(all_warnings[:10])}

Respond with:
{{
  "report": "markdown-formatted report with sections: ## What Your Code Did, ## What We Changed, ## What Needs Manual Review"
}}

The report should be honest, specific, and useful to a developer reviewing the migration."""

    return system, user
