---
inclusion: always
---

# GhostWriter — Project Steering

## What We're Building
GhostWriter migrates legacy codebases (COBOL, Pascal, VB6, Fortran, etc.) to modern Python using the GitHub API + Groq LLM. Output is a fully structured, tested, documented project.

## Project Structure
```
frontend/   React 18 + Vite + Tailwind CSS
backend/    FastAPI + Python 3.12
.kiro/      specs, steering, hooks (never gitignore this)
```

## Code Conventions

### Frontend (React)
- Functional components only, no class components
- One component per file, named same as file (PascalCase)
- Custom hooks in `src/hooks/`, prefixed with `use`
- API calls only inside hooks, never directly in components
- Tailwind for all styling — no inline styles, no CSS modules
- Error boundaries around async components

### Backend (Python)
- All endpoints in `backend/routers/`
- Business logic in `backend/services/`
- Type hints on every function signature
- Pydantic models for all request/response bodies
- Never store user code or tokens to disk
- All LLM calls go through `backend/services/llm.py`

## LLM Prompt Rules
- Always request JSON output from the LLM
- Always include language and estimated year in the prompt context
- Always ask for: migrated_code, explanation, changes, warnings, confidence, confidence_reason
- Use temperature 0.2 for migrations (deterministic), 0.7 for report prose
- Max tokens: 4096 per file migration call

## API Error Handling
- Return { error: string, code: string } for all errors
- Use HTTP 422 for validation errors, 502 for upstream API failures
- Never expose raw LLM error messages to the frontend
- Always log errors server-side with context

## UI/UX Rules (HFI Standards)
- One primary action per screen
- Every async operation needs a loading state with descriptive message
- Error messages must say what went wrong AND how to fix it
- Progressive disclosure: don't show results UI until migration completes
- Confidence score always shows reasoning, never just a number

## Color Variables (use these, not hardcoded hex)
- Background: bg-primary (#0F1117), bg-secondary (#1A1A2E)
- Text: text-primary (#E8E8E8), text-muted (#8892A4)  
- Accent: accent-blue (#00D4FF), accent-green (#00FF88)
- Dead panel: #1A1A2E | Alive panel: #0D1B2A

## Security Rules
- Never log user code content
- Never store GitHub tokens
- Validate all GitHub URLs before making API calls
- Sanitize all code before passing to Pyodide
- Redis keys for shares: prefix `gw:share:{id}`, TTL 86400 seconds

## Supported Legacy Languages
COBOL (.cbl, .cob), Pascal (.pas), VB6 (.vb, .bas, .frm), 
Fortran (.f, .f90, .for), Perl CGI (.pl, .cgi), 
ActionScript (.as), Classic ASP (.asp), Old PHP < v5 (.php)

---

## Builder Profile

**Name:** Yogesh Kulkarni
**Company:** Bilva Media Tech (Founder & Principal Engineer)
**Location:** Hyderabad / Remote
**GitHub:** github.com/yogeshhk (check for correct handle)
**CV:** cvzen.ai/u/yogesh-kulkarni-2026

**Background:** AI-Native Full-Stack Engineer, 14 years experience. Specializes in agentic systems, LLM-powered workflows, RAG pipelines, and AWS cloud infrastructure. Solo founder who owns full product arc — strategy, architecture, UX, implementation, deployment. Advanced practitioner of vibe coding (Claude Code, Cursor). Built and shipped: FundVedi (financial intelligence SaaS), cvZen (AI hiring platform), and 5+ other products.

**Relevant to GhostWriter:** Expert in LLM applications, agent systems, prompt engineering, RAG workflows, conversational AI, rapid prototyping, and production-grade AI delivery. This project directly applies his core stack.

**Education:** MSc Computer Science, University of Osmania, Hyderabad (2007)

---

## ⚠️ Kiroween 2026 — Official Rules & Eligibility (Always Check Before Acting)

### Hard Deadlines
- Submission Period: **October 30, 2026 → December 4, 2026 at 2:00 PM Pacific**
- Project MUST be started on or after October 30, 2026 — no prior work
- Kiroween 2025 projects are NOT eligible, even if modified

### Submission Checklist (every item is required)
- [ ] Public GitHub repo (NOT GitLab or BitBucket)
- [ ] All source code, assets, instructions in the repo
- [ ] Open source license file visible in repo (MIT recommended) — must be detectable in GitHub's "About" section
- [ ] `.kiro/` directory at repo root — DO NOT add to .gitignore (disqualifies submission)
- [ ] Working deployed app URL
- [ ] Text description of features and functionality
- [ ] Demo video: max 3 minutes, uploaded to YouTube (public), no copyrighted music
- [ ] Written Kiro usage write-up covering: IDE/CLI/Web/Crew, custom agents, hooks, specs, steering, MCP

### Category: Resurrection
- We are entered in **Resurrection** category
- Prize: $5,000 (category) + eligible for 1st/2nd/3rd overall ($30K/$20K/$10K)
- Cannot win both an Overall Prize AND a Category Prize — only the higher one

### Bonus Prizes We Are Eligible For (pursue all of these)
- **Best Demo** — no extra steps, all submissions considered automatically
- **Bonus Blog Prize** — publish a public blog post mentioning Kiroween 2026 hackathon on any blog platform during submission period; add post URL to submission (100 winners get 2,000 Kiro credits)
- **Social Blitz Prize** — post on any social platform with **#KiroweenHackathon26** at the START of the post; share favorite thing about Kiro (5 winners get 3-month Kiro Pro+)
- **Best Kiro Crew App** — if we add Kiro Crew features, provide public GitHub URL and description

### Judging Criteria (weight these in every decision)
1. **Potential Impact** — solves a real problem for a real audience
2. **Technological Implementation** — deep, varied, thoughtful Kiro usage
3. **Design** — complete, polished, coherent product (not just a proof of concept)
4. **Innovation/Idea** — novel concept, unexpected tech combinations
5. **Presentation** — video clearly shows end-to-end, pitch communicates problem/audience/value

### Team Rules
- Max 3 members per team
- Each member must register on Devpost
- All student team members must be enrolled at a recognized academic institution

### Code Rules
- Project must be built DURING the submission period (Oct 30 – Dec 4, 2026)
- Must be a working software application
- Must use Kiro (IDE, CLI, Web, and/or Kiro Crew)
- Repo must be public and open source with a detectable license

### What Must NOT Be Gitignored
- `.kiro/` directory and ALL subdirectories (specs, hooks, steering, agents)
- Gitignoring `.kiro/` risks disqualification
