# CLAUDE.md

Guidelines and commands for AI development agents working on this project.

---

## 🛠 Commands

Ensure code complies with these commands before completing tasks:

- **Build**: `[e.g., npm run build / cargo build / go build ./...]`
- **Run**: `[e.g., npm run dev / python main.py]`
- **Lint/Format**: `[e.g., npm run lint / ruff check .]`
- **Test**: `[e.g., npm run test / pytest / go test ./...]`
- **Test single file**: `[e.g., npm run test -- path/to/test / pytest path/to/test.py]`

---

## 📐 Coding Style & Guidelines

*(Replace with your project's actual conventions. Examples below are placeholders.)*

- **Imports**: [e.g., Use ES Module imports / Use absolute imports]
- **Async**: [e.g., Always use async/await / Use tokio for async Rust]
- **Error Handling**: [e.g., Wrap I/O in try/catch / Use Result types]
- **Types**: [e.g., Maintain TypeScript strict mode / Use type hints in Python]
- **Modularity**: [e.g., Keep functions under 50 lines / Single responsibility]
- **Hygiene**: No debugging leftovers (`console.log`, `print`, `debugger`) in commits.
- **Tests**: Write tests for all new utility functions and modules.

---

## 👤 User Preferences

*(Defined by user. Agents read but do NOT modify.)*

- **Language**: [e.g., 中文 / English]
- **Permissions**: [e.g., "Ask before deleting" / "Auto-decide OK"]
- **Style**: [e.g., "Conservative" / "Refactoring allowed"]

---

## 🏛 Key Decisions (Permanent)

| Date | Decision | Why | Alternatives |
|------|----------|-----|--------------|
| YYYY-MM-DD | [Choice] | [Reason] | [Rejected options] |

---

## 📖 Session Handoff Log

*(Keep max 10 entries. Older → `docs/dev-log-archive.md`. Newest first.)*

When finishing your session, append here:

### YYYY-MM-DD (Session Summary)
- **Agent**: [e.g., Claude Code]
- **Goal**: [What you aimed to do]
- **Actions**: [Files created/modified/deleted]
- **Decisions**: [Key architectural choices]
- **Status**: Build ✅ / Tests ✅
- **Next Steps**: [Specific instructions for next agent]

If you failed to complete something, use the failure template in `references/handoff_log_format.md`.
