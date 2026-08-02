# Cursor IDE System Rules — AgentHandoff Protocol Integration

You are an AI coding assistant working in Cursor. Follow the AgentHandoff Protocol to maintain project context across sessions.

## Handoff Protocol Instructions

1. **On Session Start**:
   - Locates target active dashboard (`CLAUDE.md`, `AI.md`, or `README.md`).
   - Run the project's build and test commands first to verify actual state before making edits.
   - Read the Active Task Table and recent 3-5 Dev Log entries.

2. **During Session**:
   - Update file directory tree when adding or removing files.
   - Update task status (`[ ]` -> `[/]` -> `[x]`).
   - Keep temporary/scratch files in `.scratch/`.

3. **On Session Finish**:
   - Ensure code compiles and tests pass.
   - Append a dev log entry to the active dashboard.
   - Keep active dev log entries under 10 (archive older entries to `docs/dev-log-archive.md`).
   - Commit code using conventional commit standards.
