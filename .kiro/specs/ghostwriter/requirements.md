# GhostWriter — Requirements

## Overview
GhostWriter is a web application that takes a GitHub URL pointing to a legacy codebase (COBOL, Pascal, VB6, Fortran, old PHP, ActionScript, Perl CGI, etc.) and migrates it to modern, runnable, tested code using an LLM API. The user receives a fully structured output project with explanation, tests, and confidence scoring.

---

## Functional Requirements

### FR-01: GitHub Repository Ingestion
- The app MUST accept a valid public GitHub repository URL as input
- The app MUST fetch all source code files from the repository using the GitHub REST API
- The app MUST support repositories up to 50 files and 500KB total
- The app MUST display the file tree of the fetched repository before migration begins
- The app MUST validate the URL format and show a clear error for invalid or private repos

### FR-02: Legacy Language Detection
- The app MUST automatically detect the legacy language(s) in the repository
- Supported legacy languages: COBOL, Pascal, VB6, Fortran, Perl CGI, ActionScript, Classic ASP, old PHP (< v5)
- The app MUST display the detected language and estimated age of the codebase
- If no legacy language is detected, the app MUST inform the user

### FR-03: LLM-Powered Migration
- The app MUST send each source file to an LLM API (Groq or Gemini) for migration
- The LLM MUST be prompted to output: migrated code, inline comments, migration notes per file
- The app MUST handle multi-file projects by processing files in dependency order
- The app MUST display a real-time progress indicator with descriptive status messages
- The target modern language MUST default to Python 3.12; user can select Node.js or Go

### FR-04: Migration Output Package
- The app MUST generate a structured output project with:
  - `/src/` — migrated source files
  - `/tests/` — auto-generated unit tests (minimum 3 per file)
  - `README.md` — auto-generated documentation
  - `requirements.txt` or `package.json` — dependency manifest
  - `.gitignore` — standard gitignore for target language
- The app MUST package the output as a downloadable ZIP file
- The app MUST display a confidence score (0–100%) per file and overall

### FR-05: Autopsy Report
- The app MUST generate a human-readable migration report containing:
  - Plain English summary of what the original code did
  - List of changes made with reasons
  - List of warnings (things that could not be fully migrated)
  - Per-file confidence scores with reasoning
- The report MUST be displayed in a dedicated tab in the results screen

### FR-06: Live Code Execution
- The app MUST allow users to run migrated Python code in-browser using Pyodide (WebAssembly)
- The app MUST display stdout and stderr output in a terminal-style panel
- The app MUST sandbox execution and prevent filesystem or network access from user code

### FR-07: Push to GitHub
- The app MUST allow users to push the migrated project to a new repo in their own GitHub account
- Authentication MUST use GitHub OAuth (user grants permission, token used once, never stored)
- The new repo MUST be named `{original-repo-name}-modernized`
- The app MUST show the link to the new repo after a successful push

### FR-08: Share Link
- The app MUST generate a shareable link to the migration result
- Shared results MUST be stored for 24 hours then automatically deleted
- Shared links MUST be read-only

---

## Non-Functional Requirements

### NFR-01: Privacy & Security
- User source code MUST never be persisted to disk or database beyond the 24-hour share window
- GitHub OAuth tokens MUST never be stored; used in-memory for single operation only
- All API calls MUST use HTTPS
- LLM prompts MUST NOT include user-identifying metadata

### NFR-02: Performance
- File fetching MUST complete within 10 seconds for repos up to 50 files
- LLM migration MUST stream responses to the UI; first token MUST appear within 3 seconds
- ZIP packaging MUST complete within 5 seconds client-side

### NFR-03: Usability (HFI Standards)
- Each screen MUST have a single primary action
- Progressive disclosure: results shown only after migration completes
- Every async operation MUST show a descriptive loading state
- Error messages MUST explain what went wrong and how to fix it
- Confidence score MUST include plain-English reasoning, not just a number

### NFR-04: Accessibility
- Color contrast MUST meet WCAG AA (4.5:1 minimum)
- All interactive elements MUST be keyboard navigable
- Code panels MUST support screen reader labels

### NFR-05: Hackathon Requirements
- The `.kiro` directory MUST be included in the repository (not gitignored)
- The repo MUST include an open-source license (MIT)
- The repo MUST be public on GitHub
- The app MUST have a working deployed URL

---

## Out of Scope
- Migrating closed-source or private repositories
- Supporting languages not in the legacy language list
- Storing user accounts or migration history beyond 24 hours
- Mobile-native apps (web responsive only)
