# Project Title

Brief 2-3 sentence project overview describing the goal, target audience, and key problems solved.

---

## 🤖 AI Agent Entrypoint

If you are an AI assistant taking over this project, follow these steps **in order**:
1. **Verify**: Run the build & test commands below. Confirm actual state matches this document.
2. **Read tasks**: Check the Active Task Tracker for current priorities.
3. **Read log**: Check the latest 3-5 entries in the AI Development Log.
4. **Declare scope**: State what you plan to accomplish this session before coding.
5. **Before leaving**: Update tasks, append a log entry, commit all changes.

Detailed log formats: see `references/handoff_log_format.md` in the agent-handoff skill.

---

## 🛠 Environment & Command Quick Start

- **Build**: `[e.g., npm run build / cargo build / go build ./...]`
- **Run Dev**: `[e.g., npm run dev / python main.py / go run .]`
- **Lint/Format**: `[e.g., npm run lint / ruff check . / golangci-lint run]`
- **Test**: `[e.g., npm run test / pytest / go test ./...]`

---

## 📂 Project Directory Structure

```text
├── src/                  # Production source code
├── tests/                # Tests
├── docs/                 # Documentation & log archive
│   └── dev-log-archive.md  # Archived dev logs (auto-managed)
├── .scratch/             # Temp/debug files (git-ignored)
└── README.md             # This dashboard
```

*(Update this tree whenever files are added/removed/restructured.)*

---

## 👤 User Preferences

*(This section is defined by the user. Agents read but do NOT modify it.)*

- **Language**: [e.g., 中文 / English]
- **Permissions**: [e.g., "Ask before deleting files" / "Auto-decide is fine"]
- **Style**: [e.g., "Conservative changes only" / "Refactoring allowed"]
- **Other rules**: [Any user-specific constraints]

---

## 📋 Active Task Tracker

### Current Goal: [One-line description]

| Task | Priority | Status | Depends On | Notes |
|------|----------|--------|------------|-------|
| [Task description] | P0/P1/P2 | [ ] | — | |
| [Task description] | P1 | [/] | Task above | In progress by [Agent name] |
| [Task description] | P2 | [ ] | — | Backlog |

Priority: **P0** = blocking, **P1** = important, **P2** = normal.

---

## 🏛 Key Decisions (Permanent — Never Archive)

| Date | Decision | Why | Alternatives Considered |
|------|----------|-----|------------------------|
| YYYY-MM-DD | [What was chosen] | [Reasoning] | [What else was considered and rejected] |

---

## 📖 AI Development Log

*(Keep max 10 entries here. Older entries → `docs/dev-log-archive.md`. Newest first.)*

### YYYY-MM-DD (Session Summary)
- **Agent**: [e.g., Claude Code, Cursor, Antigravity]
- **Goal**: [What this session aimed to do]
- **Actions**: [Files changed, features implemented]
- **Decisions**: [Key technical choices made]
- **Status**: Build ✅ / Tests ✅
- **Next Steps**: [Specific tasks for the next agent]

### YYYY-MM-DD (Session Summary)
- **Agent**: [...]
- **Goal**: [...]
- **Actions**: [...]
- **Decisions**: [...]
- **Status**: Build ✅ / Tests ❌ (see notes)
- **Next Steps**: [...]
