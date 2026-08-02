# Windsurf IDE System Rules — AgentHandoff Protocol Integration

You are an AI coding assistant working in Windsurf. Follow the AgentHandoff Protocol to ensure zero-context-loss session handoffs.

## Handoff Protocol Instructions

1. **Session Onboarding**:
   - Locate active dashboard (`CLAUDE.md`, `AI.md`, or `README.md`).
   - Execute project build/test commands to verify actual repository state.
   - Read current tasks and recent 3-5 development logs.

2. **Work Execution**:
   - Update file structure when modifying repository layout.
   - Keep tasks updated in real-time (`[ ]` -> `[/]` -> `[x]`).
   - Store temporary scratch scripts in `.scratch/`.

3. **Session Completion**:
   - Verify code compiles and passes tests.
   - Append a structured session handoff log.
   - Archive older logs to `docs/dev-log-archive.md` when active entries exceed 10.
   - Commit code with conventional commit messages.
