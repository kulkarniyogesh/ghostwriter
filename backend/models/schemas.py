from pydantic import BaseModel, HttpUrl
from typing import List, Optional


class FetchRepoRequest(BaseModel):
    url: str


class SourceFile(BaseModel):
    path: str
    content: str
    language: str
    estimated_year: Optional[int] = None
    size: int


class FetchRepoResponse(BaseModel):
    files: List[SourceFile]
    total_files: int
    repo_name: str
    detected_languages: List[str]


class MigrateRequest(BaseModel):
    files: List[SourceFile]
    target_language: str = "python"


class MigratedFile(BaseModel):
    path: str
    original_path: str
    migrated_code: str
    explanation: str
    changes: List[str]
    warnings: List[str]
    confidence: int
    confidence_reason: str
    tests: Optional[str] = None


class MigrationResult(BaseModel):
    migrated_files: List[MigratedFile]
    autopsy_report: str
    overall_confidence: int
    repo_name: str
    source_language: str
    target_language: str
    total_warnings: int


class ShareRequest(BaseModel):
    migration_result: MigrationResult


class ShareResponse(BaseModel):
    share_id: str
    expires_at: str
    share_url: str


class PushToGitHubRequest(BaseModel):
    token: str
    repo_name: str
    files: List[MigratedFile]


class PushToGitHubResponse(BaseModel):
    repo_url: str
    success: bool


class ErrorResponse(BaseModel):
    error: str
    code: str
