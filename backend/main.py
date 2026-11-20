from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from routers import fetch_repo, migrate, share, github_push

app = FastAPI(
    title="GhostWriter API",
    description="Resurrect legacy codebases to modern Python",
    version="1.0.0",
)

import os

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ghostwriter.vercel.app",
        os.getenv("FRONTEND_URL", ""),        # set this in Railway after Vercel deploy
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(fetch_repo.router, prefix="/api")
app.include_router(migrate.router, prefix="/api")
app.include_router(share.router, prefix="/api")
app.include_router(github_push.router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "alive"}
