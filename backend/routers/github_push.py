import base64
import httpx
from fastapi import APIRouter, HTTPException
from models.schemas import PushToGitHubRequest, PushToGitHubResponse

router = APIRouter()

GITHUB_API = "https://api.github.com"


@router.post("/push-to-github", response_model=PushToGitHubResponse)
async def push_to_github(request: PushToGitHubRequest):
    """
    Create a new repo in the user's GitHub account and push migrated files.
    Token is used in-memory only — never stored.
    """
    headers = {
        "Authorization": f"token {request.token}",
        "Accept": "application/vnd.github.v3+json",
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        # 1. Get authenticated user
        me = await client.get(f"{GITHUB_API}/user", headers=headers)
        if me.status_code == 401:
            raise HTTPException(401, {"error": "Invalid GitHub token.", "code": "INVALID_TOKEN"})
        username = me.json()["login"]

        # 2. Create new repo
        repo_name = request.repo_name or f"ghostwriter-migration"
        create_resp = await client.post(
            f"{GITHUB_API}/user/repos",
            headers=headers,
            json={
                "name": repo_name,
                "description": "Migrated by GhostWriter — dead code walks again.",
                "private": False,
                "auto_init": True,
            }
        )
        if create_resp.status_code == 422:
            raise HTTPException(422, {"error": f"Repo '{repo_name}' already exists in your account.", "code": "REPO_EXISTS"})
        create_resp.raise_for_status()
        repo_data = create_resp.json()
        repo_url = repo_data["html_url"]

        # 3. Push each migrated file
        for mf in request.files:
            content_b64 = base64.b64encode(mf.migrated_code.encode()).decode()
            await client.put(
                f"{GITHUB_API}/repos/{username}/{repo_name}/contents/{mf.path}",
                headers=headers,
                json={
                    "message": f"Add migrated {mf.path}",
                    "content": content_b64,
                }
            )

        # 4. Add README
        readme = f"# {repo_name}\n\nMigrated by [GhostWriter](https://ghostwriter.vercel.app) — dead code walks again.\n\nOriginal language: {request.files[0].original_path.split('.')[-1].upper() if request.files else 'Legacy'}\n"
        readme_b64 = base64.b64encode(readme.encode()).decode()

        # Get SHA of auto-init README to update it
        readme_resp = await client.get(
            f"{GITHUB_API}/repos/{username}/{repo_name}/contents/README.md",
            headers=headers,
        )
        sha = readme_resp.json().get("sha", "")
        await client.put(
            f"{GITHUB_API}/repos/{username}/{repo_name}/contents/README.md",
            headers=headers,
            json={"message": "Update README", "content": readme_b64, "sha": sha},
        )

    return PushToGitHubResponse(repo_url=repo_url, success=True)
