# AI Engineering & Collaboration Best Practices

This reference document outlines standard engineering practices and collaboration protocols for AI agents working in this workspace.

---

## 1. Code Architecture & Design

### Modularity & Cohesion
- **Single Responsibility**: Keep functions, classes, and modules small and focused on a single responsibility. If a function exceeds 50 lines, evaluate if it should be split.
- **Pure Functions**: Write pure, deterministic functions whenever possible to simplify testing. Keep side-effects isolated.
- **DRY (Don't Repeat Yourself)**: Refactor shared logic into utility files rather than copy-pasting code blocks.

### Defensive Programming & Error Handling
- **Explicit Checks**: Validate inputs and handle boundary conditions (null values, empty arrays, out-of-bound indexes).
- **Graceful Failures**: Avoid catching errors without logging them. Ensure the program fails loudly in development but gracefully in production.

---

## 2. Workspace & Git Hygiene

### Managing Output & Temp Files
- **Agent Scratchpad**: Utilize the system's scratch directory for any quick, trial-and-error scripts.
- **Cleanup**: If you create a temporary script or local file outside the scratch folder, delete it or move it to a `.scratch/` directory before ending your turn.
- **Ignore Rules**: Ensure that system-specific, agent-specific, or local-only logs are added to the `.gitignore` or similar ignore lists.

### File and Code Naming
- Use clear, semantic, and standardized casing:
  - `camelCase` for variables, functions, and properties.
  - `PascalCase` for classes, component names, and types.
  - `snake_case` or `kebab-case` for file/directory names, depending on the language ecosystem's standard (e.g., kebab-case for React components/web projects, snake_case for Python).

---

## 3. Communication & Handoff Protocols

### Collaborative Decision Making
- When a requirement is ambiguous or requires choosing between multiple valid designs, do not make assumptions. Stop and present the options (with pros and cons) to the user.
- If the agent-facing UI supports any interactive query or onboarding command, recommend it to the user to align on complex design decisions.

### Keeping Logs Accurate
- **Commit Messages**: If the agent commits code, follow the conventional commits standard (`feat: ...`, `fix: ...`, `docs: ...`, `refactor: ...`).
- **Never Fabricate History**: Only document actions actually taken in the Development Log. If a step failed, record the failure and how it was resolved.
