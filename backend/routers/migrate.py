import json
import asyncio
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from models.schemas import MigrateRequest, SourceFile
from services.llm import migrate_file, generate_tests, generate_autopsy_report

router = APIRouter()


def order_files_by_dependency(files: list[SourceFile]) -> list[SourceFile]:
    """
    Simple heuristic: process utility/copybook files before main programs.
    Main programs typically have IDENTIFICATION DIVISION or 'program' keyword.
    """
    main_files = []
    support_files = []
    for f in files:
        content_lower = f.content.lower()
        is_main = any(kw in content_lower for kw in [
            "identification division", "program-id", "program ", "void main"
        ])
        (main_files if is_main else support_files).append(f)
    return support_files + main_files


@router.post("/migrate")
async def migrate(request: MigrateRequest):
    """
    SSE streaming endpoint. Emits events:
    - progress: { file, percent, message }
    - file_done: { file, migrated_file }
    - complete: { result }
    - error: { file, message }
    """
    ordered_files = order_files_by_dependency(request.files)
    total = len(ordered_files)

    async def event_stream():
        migrated_files = []
        all_warnings = []

        for idx, source_file in enumerate(ordered_files):
            percent = int((idx / total) * 90)

            # Progress event
            yield f"data: {json.dumps({'type': 'progress', 'file': source_file.path, 'percent': percent, 'message': f'Migrating {source_file.path}...'})}\n\n"
            await asyncio.sleep(0)

            try:
                migrated = await migrate_file(source_file, request.target_language)
                tests = await generate_tests(migrated, request.target_language)
                migrated.tests = tests
                migrated_files.append(migrated)
                all_warnings.extend(migrated.warnings)

                yield f"data: {json.dumps({'type': 'file_done', 'file': source_file.path, 'migrated_file': migrated.model_dump()})}\n\n"
                await asyncio.sleep(0)

            except Exception as e:
                yield f"data: {json.dumps({'type': 'error', 'file': source_file.path, 'message': str(e)})}\n\n"
                await asyncio.sleep(0)

        # Generate autopsy report
        yield f"data: {json.dumps({'type': 'progress', 'file': '', 'percent': 95, 'message': 'Writing autopsy report...'})}\n\n"
        await asyncio.sleep(0)

        try:
            report = await generate_autopsy_report(migrated_files, request.files[0].language if request.files else "Unknown")
        except Exception:
            report = "Migration complete. See individual file reports for details."

        overall_confidence = (
            sum(f.confidence for f in migrated_files) // len(migrated_files)
            if migrated_files else 0
        )

        result = {
            "migrated_files": [f.model_dump() for f in migrated_files],
            "autopsy_report": report,
            "overall_confidence": overall_confidence,
            "repo_name": "",
            "source_language": request.files[0].language if request.files else "Unknown",
            "target_language": request.target_language,
            "total_warnings": len(all_warnings),
        }

        yield f"data: {json.dumps({'type': 'complete', 'percent': 100, 'result': result})}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        }
    )
