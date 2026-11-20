# GhostWriter — Design Document

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (React + Vite)                │
│  Landing → Processing → Results (Pyodide for execution) │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────────┐
│                FastAPI Backend (Python)                  │
│  /api/fetch-repo  /api/migrate  /api/share  /api/push   │
└───────┬──────────────────┬───────────────────┬──────────┘
        │                  │                   │
┌───────▼──────┐  ┌────────▼───────┐  ┌───────▼──────────┐
│  GitHub API  │  │   Groq / Gemini │  │  Redis (24hr TTL)│
│  (fetch code)│  │   LLM API       │  │  (share links)   │
└──────────────┘  └────────────────┘  └──────────────────┘
```

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | React 18 + Vite | Fast, modern, component-based |
| Styling | Tailwind CSS | Utility-first, fast to build |
| Code display | Monaco Editor | VS Code's editor, syntax highlight |
| In-browser execution | Pyodide (WebAssembly) | Run Python in browser, free, sandboxed |
| Backend | FastAPI (Python) | Async, fast, easy LLM integration |
| LLM | Groq (llama-3.3-70b) | Free tier, fast inference, great code quality |
| LLM fallback | Gemini 1.5 Flash | Free tier backup |
| File packaging | JSZip (client-side) | ZIP in browser, no server needed |
| Share storage | Redis (Upstash free tier) | 24hr TTL, serverless |
| Deployment | Vercel (frontend) + Railway (backend) | Both free tier |

---

## Screen Designs

### Screen 1: Landing Page

**Visual Hierarchy (HFI):**
1. Logo + tagline (orient the user)
2. Single URL input (the only job)
3. CTA button (one primary action)
4. Example repos (reduce friction, show what's supported)

```
┌─────────────────────────────────────────────┐
│                                             │
│   💀 GhostWriter                           │
│   Bring your dead code back to life        │
│                                             │
│   ┌─────────────────────────────────────┐  │
│   │ github.com/owner/legacy-repo        │  │
│   └─────────────────────────────────────┘  │
│                                             │
│   [ ⚡ RESURRECT ]                         │
│                                             │
│   Try an example:                          │
│   • COBOL payroll system (1987)            │
│   • Pascal student database (1994)         │
│   • VB6 inventory manager (2001)           │
│                                             │
└─────────────────────────────────────────────┘
```

---

### Screen 2: Processing Page

**Visual Hierarchy (HFI):**
1. Progress bar (where are we?)
2. Current step message (what's happening?)
3. File tree building (show work in progress)

```
┌─────────────────────────────────────────────┐
│  Resurrecting your codebase...             │
│  ████████████░░░░░░░░  60%                 │
│                                             │
│  ⚗️  Analyzing 14 files...                │
│                                             │
│  📁 payroll-system/                        │
│    ✓ PAYROLL.CBL      (detected: COBOL)    │
│    ✓ EMPLOYEE.CBL     (detected: COBOL)    │
│    ⟳ TAXES.CBL        (migrating...)       │
│    ○ REPORTS.CBL      (waiting)            │
│                                             │
└─────────────────────────────────────────────┘
```

---

### Screen 3: Results Page

**Visual Hierarchy (HFI):**
1. Status + confidence score (did it work?)
2. Split code panel (the core value)
3. Tab panel (details on demand — progressive disclosure)
4. Action buttons (what to do next)

```
┌─────────────────────────────────────────────────────┐
│  ✅ Migration Complete  ·  Overall Confidence: 94%  │
├────────────────────────┬────────────────────────────┤
│  💀 BEFORE             │  ✨ AFTER                  │
│  COBOL · 1987          │  Python 3.12 · 2026        │
│  ────────────────────  │  ──────────────────────    │
│  IDENTIFICATION        │  def calculate_payroll(    │
│    DIVISION.           │    employee_name,          │
│  PROGRAM-ID.           │    hours_worked,           │
│    PAYROLL.            │    hourly_rate             │
│                        │  ):                        │
│  [file selector ▼]     │  [file selector ▼]         │
├────────────────────────┴────────────────────────────┤
│  [📋 Report] [🧪 Tests] [⚠️ Warnings]               │
│                                                     │
│  WHAT YOUR CODE DID                                 │
│  This COBOL program processed payroll for           │
│  employees. It calculated gross/net pay and         │
│  printed payslips from a fixed-width flat file.     │
├─────────────────────────────────────────────────────┤
│  [▶ Run Live]  [⬇ Download ZIP]  [🔗 Push to GitHub]│
└─────────────────────────────────────────────────────┘
```

---

## Color System

```css
/* Base */
--bg-primary:    #0F1117;   /* near-black background */
--bg-secondary:  #1A1A2E;   /* dead code panel */
--bg-tertiary:   #0D1B2A;   /* alive code panel */

/* Text */
--text-primary:  #E8E8E8;   /* main text */
--text-muted:    #8892A4;   /* secondary text */

/* Accents */
--accent-blue:   #00D4FF;   /* CTAs, links, highlights */
--accent-green:  #00FF88;   /* success, alive/new code */
--accent-amber:  #FFB800;   /* warnings */
--accent-red:    #FF4D6D;   /* errors */

/* Code panels */
--dead-panel:    #1A1A2E;   /* dim, desaturated */
--alive-panel:   #0D1B2A;   /* vivid, electric */
```

---

## Component Architecture

```
src/
├── components/
│   ├── LandingPage/
│   │   ├── UrlInput.jsx          ← URL input + validation
│   │   ├── ExampleRepos.jsx      ← clickable examples
│   │   └── LandingPage.jsx
│   ├── Processing/
│   │   ├── ProgressBar.jsx       ← animated progress
│   │   ├── FileTreeBuilder.jsx   ← live file tree
│   │   └── ProcessingPage.jsx
│   ├── Results/
│   │   ├── SplitCodePanel.jsx    ← Monaco editor x2
│   │   ├── FileSelector.jsx      ← switch between files
│   │   ├── ReportTab.jsx         ← autopsy report
│   │   ├── TestsTab.jsx          ← unit test results
│   │   ├── WarningsTab.jsx       ← migration warnings
│   │   ├── ActionBar.jsx         ← run/download/push
│   │   └── ResultsPage.jsx
│   ├── Terminal/
│   │   └── LiveTerminal.jsx      ← Pyodide output
│   └── shared/
│       ├── ConfidenceBadge.jsx
│       ├── LoadingState.jsx
│       └── ErrorMessage.jsx
├── hooks/
│   ├── useGitHubFetch.js         ← GitHub API calls
│   ├── useMigration.js           ← SSE streaming from backend
│   ├── usePyodide.js             ← in-browser Python execution
│   └── useGitHubPush.js          ← OAuth + repo creation
├── api/
│   └── client.js                 ← backend API calls
└── App.jsx
```

---

## Backend API Endpoints

### POST /api/fetch-repo
```json
Request:  { "url": "https://github.com/owner/repo" }
Response: { "files": [{ "path": "main.cbl", "content": "...", "language": "COBOL" }], "total_files": 14 }
```

### POST /api/migrate (Server-Sent Events stream)
```json
Request:  { "files": [...], "target_language": "python" }
Stream:   { "type": "progress", "file": "main.cbl", "percent": 60 }
          { "type": "file_done", "file": "main.cbl", "migrated": "...", "confidence": 94, "notes": "..." }
          { "type": "complete", "report": "...", "tests": "...", "warnings": [...] }
```

### POST /api/share
```json
Request:  { "migration_result": {...} }
Response: { "share_id": "abc123", "expires_at": "2026-11-21T22:00:00Z" }
```

### POST /api/push-to-github
```json
Request:  { "token": "ghp_...", "repo_name": "payroll-modernized", "files": [...] }
Response: { "repo_url": "https://github.com/username/payroll-modernized" }
```

---

## LLM Prompt Strategy

### Per-File Migration Prompt
```
You are an expert code migration engineer.

LEGACY CODE ({{language}}, circa {{year}}):
{{source_code}}

Your tasks:
1. Rewrite this in modern {{target_language}} (clean, idiomatic, production-quality)
2. Add inline comments explaining non-obvious logic
3. Write a brief plain-English explanation of what this code does
4. List every change you made and why
5. Flag anything you could not migrate with a WARNING comment
6. Assign a confidence score 0-100 with one sentence of reasoning

Output as JSON:
{
  "migrated_code": "...",
  "explanation": "...",
  "changes": ["..."],
  "warnings": ["..."],
  "confidence": 94,
  "confidence_reason": "..."
}
```

---

## Kiro-Specific Features Used

| Feature | How Used |
|---|---|
| **Specs** | This document — structured requirements → design → tasks |
| **Hooks** | PostFileSave: auto-lint; PostTaskExec: run tests |
| **Steering** | Project conventions, API patterns, prompt templates |
| **MCP** | GitHub MCP for repo operations |
| **Custom Agents** | One agent per legacy language (COBOL agent, Pascal agent, etc.) |
