# Project Title

Brief 2-3 sentence project overview describing the goal, target audience, and key problems solved.

---

## 🤖 AI Agent Entrypoint

If you are an AI assistant (e.g., Claude Code, Codex, Hermes Agent, Antigravity) taking over this project, please follow these guidelines:
1. **Commands**: Refer to the **Environment & Command Quick Start** section below.
2. **Guidelines**: Ensure all modifications follow the directory structure and coding conventions.
3. **Log & Handoff**: Update the **Task Tracker** and append your session notes to the **AI Development Log** before finishing.

---

## 🛠 Environment & Command Quick Start

Below are the commands used by developers and AI agents to compile, run, verify, and test the project:

- **Build**: `[e.g., npm run build]`
- **Run Dev**: `[e.g., npm run dev]`
- **Lint/Format**: `[e.g., npm run lint]`
- **Test**: `[e.g., npm run test]`

---

## 📂 Project Directory Structure

```text
├── src/                  # Production source code
│   ├── components/       # Reusable UI components
│   └── utils/            # Utility and helper functions
├── tests/                # Unit, integration, and E2E tests
├── docs/                 # Extended documentation and guides
├── config/               # Custom configuration files
├── .scratch/             # Debugging scripts and trial outputs (git-ignored)
├── README.md             # Active project dashboard (this file)
└── package.json          # Project dependencies and scripts
```

*Rules for file placement:*
- *Production components go in `src/components/`.*
- *All utility files must have matching `.test.js` files in `tests/`.*
- *Do not place loose files in the root unless they are project configuration.*

---

## 📋 Active Task Tracker

### Current Goal: [Describe active high-level goal]
- [/] Active Task (Currently in progress)
- [ ] Next Task (Pending)
- [ ] Future Task

### Task History & Backlog:
- [x] Completed task 1 (Completed: YYYY-MM-DD)
- [x] Completed task 2 (Completed: YYYY-MM-DD)
- [ ] Backlog task A

---

## 📖 AI Development Log

This is a reverse-chronological log recording changes, key architectural decisions, and current project health.

### YYYY-MM-DD (Session #2 - Task Description)
- **Agent**: [e.g., Claude Code, Antigravity, etc.]
- **Actions**:
  - Implemented the user authentication service in `src/utils/auth.js`.
  - Added unit tests in `tests/auth.test.js`.
- **Decisions**:
  - Used JWT tokens stored in localStorage for session state management.
- **Current State**:
  - Build status: Passing.
  - Test coverage: 94%.
- **Next Steps**:
  - Design the Login UI component in `src/components/Login.jsx`.

### YYYY-MM-DD (Session #1 - Initial Project Setup)
- **Actions**:
  - Initialized repository structure.
  - Setup ESLint and Prettier.
- **Decisions**:
  - Standardized on ES Modules.
- **Current State**:
  - Fresh setup, ready for development.
- **Next Steps**:
  - Write standard authentication logic.
