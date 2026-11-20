# GhostWriter — Implementation Tasks

## Status Legend
- [ ] Not started
- [~] In progress
- [x] Complete

---

## Phase 1: Project Scaffold ✅

- [x] **TASK-01** React + Vite frontend — tailwindcss, monaco-editor, jszip, axios installed
- [x] **TASK-02** FastAPI backend — fastapi, uvicorn, httpx, python-dotenv, redis, sse-starlette, groq installed
- [x] **TASK-03** Root structure — frontend/, backend/, README.md, LICENSE (MIT), .gitignore, .kiro/
- [x] **TASK-04** Environment variables — backend/.env, frontend/.env.local, both .env.example files

---

## Phase 2: Backend — GitHub Ingestion ✅

- [x] **TASK-05** GitHub API fetch — `routers/fetch_repo.py` (URL parse, tree fetch, file fetch, 50 file limit)
- [x] **TASK-06** Language detector — `services/detector.py` (8 languages, extension map, era markers)
- [x] **TASK-07** POST /api/fetch-repo — validation, error handling (404, 403, rate limit, no legacy files)

---

## Phase 3: Backend — LLM Migration ✅

- [x] **TASK-08** LLM client — `services/llm.py` (Groq openai/gpt-oss-120b, 3-retry, JSON parse, fallback)
- [x] **TASK-09** Prompt builder — `services/prompts.py` (per-language personas, migration/test/report prompts)
- [x] **TASK-10** Migration pipeline — `routers/migrate.py` (dependency ordering, per-file migrate + tests + report)
- [x] **TASK-11** POST /api/migrate SSE — progress/file_done/complete/error events streaming

---

## Phase 4: Backend — Output & Share ✅

- [x] **TASK-12** Share service — `routers/share.py` (Redis 24hr TTL, nanoid, GET /api/share/{id})
- [x] **TASK-13** GitHub push service — `routers/github_push.py` (OAuth token, create repo, push files, README)
- [x] **TASK-14** POST /api/push-to-github — token validation, repo creation, file push, return URL

---

## Phase 5: Frontend — Landing Page ✅

- [x] **TASK-15** UrlInput.jsx — regex validation, real-time green/red feedback, Enter submit, loading state
- [x] **TASK-16** ExampleRepos.jsx — 3 examples (COBOL/Fortran/ASP), language badge, year, click to fill
- [x] **TASK-17** LandingPage.jsx — full-screen dark, ghost logo, tagline, URL input, examples, language pills

---

## Phase 6: Frontend — Processing Page ✅

- [x] **TASK-18** ProgressBar.jsx — animated gradient fill, glow effect, smooth transitions
- [x] **TASK-19** FileTreeBuilder.jsx — live status icons (✓/⟳/○/✗), language badge per file
- [x] **TASK-20** ProcessingPage.jsx — SSE consumer, real-time progress, ghost-themed status messages

---

## Phase 7: Frontend — Results Page ✅

- [x] **TASK-21** SplitCodePanel.jsx — dual Monaco editors, HAUNTED/AFTER labels, file selector tabs
- [x] **TASK-22** ConfidenceBadge.jsx — green/amber/red color coding, hover tooltip with reason
- [x] **TASK-23** ReportTab.jsx — ghost story sections, per-file confidence scores
- [x] **TASK-24** TestsTab.jsx — Monaco syntax highlight, file tabs
- [x] **TASK-25** WarningsTab.jsx — warnings grouped by file, amber styling
- [x] **TASK-26** ActionBar.jsx — Run Live, Download ZIP (JSZip), Share (clipboard)
- [x] **TASK-27** ResultsPage.jsx — status bar, split panel, tabbed panel, action bar, back button

---

## Phase 8: Frontend — Live Execution ✅

- [x] **TASK-28** usePyodide.js hook — CDN load on demand, runCode(), stdout/stderr capture, pre-warm on results page load
- [x] **TASK-29** LiveTerminal.jsx — terminal panel, auto-scroll, green stdout, red stderr, loading state, Clear + Close buttons

---

## Phase 9: Kiro Configuration ✅ (partial)

- [x] **TASK-30** Steering file — `.kiro/steering/ghostwriter.md` (conventions, prompts, rules, hackathon rules)
- [x] **TASK-31** Hooks — PostFileSave (Black, ESLint), PostTaskExec (pytest)
- [x] **TASK-32** Custom agents — COBOL agent, Pascal agent, Code Review agent

---

## Phase 10: Deployment & Polish ❌ NOT DONE

- [ ] **TASK-33** Deploy frontend to Vercel
- [ ] **TASK-34** Deploy backend to Railway + Redis
- [ ] **TASK-35** End-to-end test with real legacy repos (COBOL, Pascal, VB6)
- [ ] **TASK-36** Record demo video (≤ 3 min, YouTube public)
- [ ] **TASK-37** Write hackathon submission (Devpost, blog, social post)

---

## Remaining Work Summary

| # | Task | Priority |
|---|---|---|
| TASK-28 | Pyodide hook (run Python in browser) | High — needed for "Run Live" button |
| TASK-29 | LiveTerminal component | High — needed for "Run Live" button |
| TASK-32 | Custom agents (.kiro/agents/) | Medium — boosts judging score |
| TASK-33 | Deploy to Vercel | Critical — required to submit |
| TASK-34 | Deploy to Railway + Redis | Critical — required to submit |
| TASK-35 | End-to-end test with real repos | Critical — must work before submitting |
| TASK-36 | Demo video | Critical — required to submit |
| TASK-37 | Devpost submission + blog + social | Critical — deadline Dec 4 |
