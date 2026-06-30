# CLAUDE.md

Guidelines and commands for Claude Code and other AI development agents working on this project.

---

## 🛠 Commands

Ensure code complies with commands before completing tasks:

- **Build**: `[e.g., npm run build]`
- **Run**: `[e.g., npm run dev]`
- **Lint/Format**: `[e.g., npm run lint]`
- **Test**: `[e.g., npm run test]`
- **Test single file**: `[e.g., npm run test -- src/utils/auth.test.js]`

---

## 📐 Coding Style & Guidelines

- **Imports**: Use ES Module imports (`import ... from '...'`). Prefer named imports where applicable.
- **Async/Await**: Always use `async/await` rather than raw promises for asynchronous operations.
- **Error Handling**: Wrap external API and I/O operations in `try/catch` blocks. Do not swallow errors.
- **Types**: Maintain TypeScript configurations. Keep components and functions properly typed.
- **Modularity**: Prioritize functional programming. Keep components and hooks under 100 lines of code.
- **Hygiene**: Do not leave debugging tools (`console.log`, `debugger`) in production commits.
- **Tests**: Write unit tests for all new helper functions and utility files.

---

## 📖 Session Handoff Log

When finishing your current run, please append your session summary here.

### YYYY-MM-DD (Session #1 - Task Title)
- **Agent**: [e.g., Claude Code]
- **Actions**:
  - Summarize what files were created or modified.
- **Decisions**:
  - Key architectural decisions made during the session.
- **Next Steps**:
  - Specific instructions for the next agent session.
