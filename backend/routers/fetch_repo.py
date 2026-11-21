import re
import base64
import httpx
import os
from fastapi import APIRouter, HTTPException
from models.schemas import FetchRepoRequest, FetchRepoResponse, SourceFile
from services.detector import detect_language, is_legacy

router = APIRouter()

GITHUB_API = "https://api.github.com"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
MAX_FILES = 50
MAX_FILE_SIZE = 50_000  # 50KB per file

SUPPORTED_EXTENSIONS = {
    ".cbl", ".cob", ".cpy", ".pas", ".pp",
    ".vb", ".bas", ".frm", ".cls",
    ".f", ".f90", ".f95", ".for",
    ".pl", ".cgi", ".as", ".asp", ".php",
    ".clle", ".rpgle", ".clp",  # AS400 / IBM i
}


def parse_github_url(url: str) -> tuple[str, str]:
    """Extract owner and repo from GitHub URL."""
    pattern = r"github\.com/([^/]+)/([^/?\s#]+)"
    match = re.search(pattern, url)
    if not match:
        raise HTTPException(422, {"error": "Invalid GitHub URL. Use format: https://github.com/owner/repo", "code": "INVALID_URL"})
    return match.group(1), match.group(2).rstrip(".git")


def github_headers() -> dict:
    headers = {"Accept": "application/vnd.github.v3+json"}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    return headers


async def get_tree(client: httpx.AsyncClient, owner: str, repo: str) -> list:
    """Get full recursive file tree from GitHub."""
    resp = await client.get(
        f"{GITHUB_API}/repos/{owner}/{repo}/git/trees/HEAD?recursive=1",
        headers=github_headers(),
    )
    if resp.status_code == 404:
        raise HTTPException(404, {"error": "Repository not found or is private.", "code": "REPO_NOT_FOUND"})
    if resp.status_code == 403:
        raise HTTPException(403, {"error": "GitHub API rate limit exceeded. Try again in an hour.", "code": "RATE_LIMITED"})
    resp.raise_for_status()
    tree = resp.json().get("tree", [])
    return [
        item for item in tree
        if item["type"] == "blob"
        and any(item["path"].endswith(ext) for ext in SUPPORTED_EXTENSIONS)
        and item.get("size", 0) < MAX_FILE_SIZE
    ]


async def fetch_file(client: httpx.AsyncClient, owner: str, repo: str, path: str) -> str:
    """Fetch a single file's content from GitHub."""
    resp = await client.get(
        f"{GITHUB_API}/repos/{owner}/{repo}/contents/{path}",
        headers=github_headers(),
    )
    resp.raise_for_status()
    data = resp.json()
    content = data.get("content", "")
    return base64.b64decode(content).decode("utf-8", errors="replace")


@router.post("/fetch-repo", response_model=FetchRepoResponse)
async def fetch_repo(request: FetchRepoRequest):
    owner, repo = parse_github_url(request.url)

    async with httpx.AsyncClient(timeout=15.0) as client:
        tree = await get_tree(client, owner, repo)

        if not tree:
            raise HTTPException(422, {
                "error": "No supported legacy files found. Supported: COBOL, Pascal, VB6, Fortran, Perl, ActionScript, Classic ASP, old PHP.",
                "code": "NO_LEGACY_FILES"
            })

        # Limit to MAX_FILES
        tree = tree[:MAX_FILES]

        source_files = []
        for item in tree:
            content = await fetch_file(client, owner, repo, item["path"])
            detection = detect_language(item["path"], content)
            source_files.append(SourceFile(
                path=item["path"],
                content=content,
                language=detection["language"],
                estimated_year=detection["estimated_year"],
                size=len(content),
            ))

    detected_languages = list({f.language for f in source_files if is_legacy(f.language)})

    return FetchRepoResponse(
        files=source_files,
        total_files=len(source_files),
        repo_name=repo,
        detected_languages=detected_languages,
    )
