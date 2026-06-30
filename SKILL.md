---
name: agent-handoff
slug: agent-handoff
displayName: AgentHandoff
version: 1.0.0
author: tkgeeked
homepage: https://github.com/tkgeeked/agent-handoff
description: Enforces seamless context handoffs and project governance for multiple AI agents (including Claude Code, Codex, Hermes Agent, and Antigravity). Instructs the AI to maintain a self-documenting project dashboard and reverse-chronological development logs to eliminate onboarding friction between different AI sessions.
---

# AI Agent Governance & Handoff Specification

This skill establishes a standardized workflow and behavioral specification for AI agents taking over, maintaining, or handing off workspaces. **Its primary objective is to eliminate the context gap and onboarding friction when switching between different AI agents (e.g., Claude Code, Codex, Hermes, Antigravity) on the same project.**

It ensures that you (the active AI agent) maintain a "live project dashboard" and "development log" so that the next agent can resume work instantly with zero information loss.

---

## 1. Multi-Agent Compatibility Layer

Different agents read configuration and rules from different file locations. Adapt your governance to the active environment:

-   **Claude Code**: Reads configuration and commands from `CLAUDE.md` at the root.
-   **Antigravity / Codex**: Reads custom instructions from `SKILL.md` (within customizations) or `.agents/`.
-   **Cursor / Windsurf**: Reads rules from `.cursorrules` or `.windsurfrules`.
-   **Hermes Agent & Others**: Read onboarding instructions and context from the project `README.md` (specifically the `## 🤖 AI Agent Entrypoint` section) or a standalone `AI.md`.

---

## 2. Onboarding Protocol (Eliminating the Information Gap)

Whenever you take over a workspace or begin a session, you **MUST** execute these onboarding steps before writing any code:

1.  **Identify the Handoff Document**:
    - Locate `CLAUDE.md`, `README.md` (look for the "AI Agent Entrypoint" section), or `AI.md` in the workspace root.
    - If none exist, initialize the project dashboard using the templates in the [resources/](resources/) folder.
2.  **Verify Commands & Environment**:
    - Identify the correct commands to **build**, **run**, **lint**, and **test** the project.
3.  **Read the Active Task Tracker**:
    - Review the pending and in-progress tasks to understand what needs to be worked on immediately.
4.  **Analyze the Session History**:
    - Check the recent entries in the **Development Log** to understand:
      - What modifications were made in the previous session.
      - Key technical decisions and design trade-offs.
      - Specific tasks left for the next agent session.

---

## 3. Maintaining the Live Dashboard

You **MUST** keep the project dashboard updated:
-   **Directory Tree**: Update the directory tree layout in the documentation whenever files/folders are restructured.
-   **Task Tracker**: Update the status of tasks (`[ ]` to `[/]` or `[x]`) as you work.
-   **Development Log**: Append a summary entry at the end of your session (see Session Handoff Protocol below).

---

## 4. Directory Layout & Hygiene Standards

Maintain high structural hygiene across all projects:
-   **Production Code**: Inside standard directories (`src/`, `lib/`, `app/`, etc.). Keep the root clean.
-   **Tests**: Place tests next to source files or in a dedicated `tests/` directory.
-   **Config Files**: Restrict root-level files to necessary environment and tool configurations.
-   **Scratch / Temporary Files**: Never commit debugging scripts or experimental files to production code folders. Use the agent-specific scratchpad or add a local `.scratch/` directory to `.gitignore`.

---

## 5. Session Handoff Protocol (Preparing for the Next Agent)

At the end of your current session, you **MUST** ensure the handoff is perfect for the next agent:
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
