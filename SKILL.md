---
name: ai-agent-governance
description: Standardizes project governance and workspace handoffs for multiple AI agents (including Claude Code, Codex, Hermes Agent, and Antigravity). Enforces the use of a live project dashboard (README.md/CLAUDE.md) and development logs to ensure seamless session continuity.
---

# AI Agent Governance & Handoff Specification

This specification defines a standardized workflow and project-governance system compatible with all modern coding agents (such as **Claude Code**, **Codex**, **Hermes Agent**, and **Antigravity**). It ensures that any agent taking over a project inherits a clear roadmap, directory conventions, and a reverse-chronological development log.

---

## 1. Multi-Agent Compatibility Layer

Different agents look for different configuration entry points in the workspace root. The governance system adapts to each:

-   **Claude Code**: Reads configuration and commands from `CLAUDE.md` at the root.
-   **Antigravity / Codex**: Reads custom instructions from `SKILL.md` (within customizations) or `.agents/`.
-   **Cursor / Windsurf**: Reads rules from `.cursorrules` or `.windsurfrules`.
-   **Hermes Agent & Others**: Read onboarding instructions and context from the project `README.md` (in a designated `## 🤖 AI Agent Entrypoint` section) or a standalone `AI.md`.

---

## 2. Agent Onboarding Checklist

Whenever you (the AI Agent) take over a workspace, you **MUST** perform the following steps before modifying any code:

1.  **Locate the Agent Entry Point**:
    - Search for `CLAUDE.md`, `README.md` (look for the "AI Agent Entrypoint" section), or `AI.md`.
    - If none exist, initialize the project dashboard using the templates in the [resources/](resources/) folder.
2.  **Verify Commands & Environment**:
    - Identify the correct commands to **build**, **run**, **lint**, and **test** the project.
3.  **Map the Structure**:
    - Confirm the file placement rules (e.g., where production source, tests, and configurations are expected to live).
4.  **Read the Active Task Tracker & Development Log**:
    - Review the checklist of pending/active tasks.
    - Check the recent entries in the **Development Log** to understand what was done in the previous session and what context is handed over.

---

## 3. Maintaining the Live Dashboard

You **MUST** keep the project dashboard updated:
-   **Directory Tree**: Update the directory tree layout in the documentation whenever files/folders are restructured.
-   **Task Tracker**: Update the status of tasks (`[ ]` to `[/]` or `[x]`) as you work.
-   **Development Log**: Append a summary entry at the end of your session (see Session Handover below).

---

## 4. Directory Layout & Hygiene Standards

Maintain high structural hygiene across all projects:
-   **Production Code**: Inside standard directories (`src/`, `lib/`, `app/`, etc.). Keep the root clean.
-   **Tests**: Place tests next to source files or in a dedicated `tests/` directory.
-   **Config Files**: Restrict root-level files to necessary environment and tool configurations.
-   **Scratch / Temporary Files**: Never commit debugging scripts or experimental files to production code folders. Use the agent-specific scratchpad or add a local `.scratch/` directory to `.gitignore`.

---

## 5. Session Handover Protocol

At the end of your current session:
1.  Verify the codebase compiles and all tests pass.
2.  Update the **Task Tracker** (mark completed tasks, add newly discovered backlog items).
3.  Append an entry to the **Development Log** (in `README.md`, `CLAUDE.md`, or `AI.md`):
    ```markdown
    ### YYYY-MM-DD (Session Summary)
    - **Agent**: [e.g., Claude Code, Antigravity, etc.]
    - **Actions**: Files modified and features implemented.
    - **Decisions**: Key technical decisions, trade-offs, or dependencies added.
    - **Current State**: Project health, build, and test status.
    - **Next Steps**: Explicit tasks for the next agent to pick up.
    ```
4.  Provide a summary of these handoff notes in your final message to the user.
