# 🤖 AgentHandoff

[简体中文](#简体中文) | English

A lightweight, developer-focused framework designed to **eliminate the context gap and onboarding friction when switching between different AI coding assistants** (such as **Claude Code**, **Codex**, **Hermes Agent**, **Antigravity**, **Cursor**, and **Windsurf**) on the same project.

---

## Why This Exists

When developing a project, you often switch between different AI agents to leverage their unique strengths. However, this creates a major pain point: **every new agent session starts with a blank slate**. You have to manually re-explain:
1. The project's overall roadmap and what was *just* completed.
2. The coding standards and directory layout rules.
3. The technical decisions and logic behind recent modifications.

This system acts as a **universal handoff protocol**. By forcing every agent to maintain a standardized, self-updating **Active Dashboard** and **Development Log** in the repository, any incoming agent can read the files and immediately resume work exactly where the last one left off—zero explanations required.

---

## Core Mechanisms

```text
 [AI Agent A]                                                         [AI Agent B]
  (Finishes)                                                           (Starts)
      │                                                                   │
      ▼                                                                   ▼
Writes Handoff Log ──> [ Active Dashboard & Dev Log ] ──> Reads & Verifies ──> Resumes Work
Updates Task list      (README.md / CLAUDE.md / AI.md)    (runs build/test first)
```

1. **Active Dashboard**: A single source of truth containing file structure, live task statuses, user preferences, and key decisions.
2. **Reverse-Chronological Dev Log**: Appended by the agent at the end of every session. Max 10 entries kept; older ones archived to `docs/dev-log-archive.md`.
3. **Verification Step**: Incoming agents must run build/test to confirm actual state matches documentation before trusting it.
4. **Failure Protocol**: Standardized templates for recording what went wrong, what was tried, and what the next agent should do.
5. **Directory Hygiene**: Enforced separation between source code, tests, docs, and temporary scratchpads.

---

## What's New in v2.0

| Feature | Description |
|---------|-------------|
| Verification step | Agents must confirm actual project state, not just trust docs |
| Log archival | Max 10 entries in dashboard; older ones archived (never deleted) |
| Failure templates | Standardized format for recording failures and blocked work |
| Task priorities | P0/P1/P2 with dependency tracking |
| User preferences | Dedicated section for user-defined rules (agents read, never modify) |
| Key Decisions (ADR) | Permanent section for architectural decisions (never archived) |
| Git integration | Commit conventions, WIP handling, mandatory commit before session end |
| Parallel awareness | Guidelines for avoiding conflicts when multiple agents work simultaneously |
| Platform fallback | Principle-based adaptation instead of hardcoded agent list |
| De-JS templates | Language-agnostic placeholders (Node/Python/Go/Rust examples) |

---

## Platform Support Matrix

| Tool / Agent | Target File | Onboarding Mechanism |
| :--- | :--- | :--- |
| **Claude Code** | `CLAUDE.md` | Reads build/test commands and project rules at startup. |
| **Antigravity / Codex** | `SKILL.md` | Loads as a custom skill/tool rule dynamically from `.agents/`. |
| **Cursor / Windsurf** | `.cursorrules` / `.windsurfrules` | Ingests instructions as system prompts. |
| **Other Agents** | `README.md` or `AI.md` | Falls back to `AI Agent Entrypoint` section. |

**Fallback rule**: If your agent isn't listed, search for: `CLAUDE.md` → `AI.md` → `README.md`. Use the first one found.

---

## File Structure

```text
agent-handoff/
├── .github/workflows/ci.yml       # GitHub Actions CI for Markdown & Handoff validation
├── SKILL.md                        # Core protocol (concise, loaded every session)
├── README.md                       # This file (human-facing, full explanation)
├── scripts/
│   └── validate-handoff.mjs        # Mechanical validation & log auto-archiver
├── references/
│   ├── handoff_log_format.md       # Log templates: normal, failure, issue-found
│   └── best_practices.md           # Project-specific constraints template
└── resources/
    ├── README.template.md          # Dashboard template for new projects
    ├── CLAUDE.template.md          # Claude Code config template
    ├── cursorrules.md              # Cursor IDE system prompt template
    └── windsurfrules.md            # Windsurf IDE system prompt template
```

---

## Tooling & Verification

Verify active dashboard compliance or auto-archive logs via Node.js:

```bash
# Validate dashboard structure
node scripts/validate-handoff.mjs --check

# Auto-archive entries beyond 10 into docs/dev-log-archive.md
node scripts/validate-handoff.mjs --archive
```

---

## Setup & Installation

### 1. Global Setup (All workspaces)

For Antigravity/Codex:
```bash
git clone https://github.com/tkgeeked/agent-handoff.git ~/.gemini/config/skills/agent-handoff
```

### 2. Local Project Integration

```bash
mkdir -p .agents/skills
git clone https://github.com/tkgeeked/agent-handoff.git .agents/skills/agent-handoff
```

#### For Claude Code
```bash
cp resources/CLAUDE.template.md /path/to/your/project/CLAUDE.md
```

#### For Other Agents
```bash
cp resources/README.template.md /path/to/your/project/README.md
```

---

## License

MIT License.

---

## 简体中文

# AgentHandoff - AI 项目接管与自我治理规范

这是一个轻量级、面向开发者的项目治理框架，旨在**消除在同一个项目上切换不同 AI 助手时的信息差与接管摩擦**。

---

## 解决的问题

在实际开发中，我们经常会在同一个项目里混用不同的 AI 工具。但每次切换 AI 助手，它对项目当前的进度都是一无所知的。你必须重新说明：
1. 项目的整体进度、当前进行到哪一步、下一步该做什么。
2. 本项目的目录结构规范和代码编写约束。
3. 最近代码修改背后的设计意图和技术决策。

本规范充当了 **AI Agent 之间的"万能交接协议"**。通过在仓库中建立一个自我更新的**活体看板**，让每一个 AI 在退出前自动更新状态并撰写日志，任何新接入的 AI 只需读取该文档，即可立即进入状态。

---

## 核心机制

1. **活体看板**：由 AI 实时维护的单一事实来源，包含文件树、任务状态、用户偏好和重要决策。
2. **逆序开发日志**：每次会话结束前记录。最多保留 10 条，更早的归档到 `docs/dev-log-archive.md`（永不删除）。
3. **验证步骤**：新 AI 接手时必须先跑构建/测试，确认实际状态与文档一致，不能光读就信。
4. **失败协议**：标准化的模板，记录"哪里出了问题、试过什么、下一步建议"。
5. **目录卫生**：清晰定义生产代码、测试、临时脚本的存放位置。

---

## v2.0 新增内容

| 功能 | 说明 |
|------|------|
| 验证步骤 | 接手时先跑 build/test，不盲信文档 |
| 日志归档 | 看板最多 10 条，旧的归档（不删除） |
| 失败模板 | 没搞定怎么写、发现问题怎么写 |
| 任务优先级 | P0/P1/P2 + 依赖关系 |
| 用户偏好区 | 用户定义规矩，AI 只读不改 |
| 重要决策记录 | 永久保留，不随日志归档 |
| Git 整合 | 提交规范、WIP 处理、必须 commit |
| 并行协作 | 多 Agent 同时工作时的避冲突指引 |
| 平台回退 | 原则性适配，不再硬编码 Agent 列表 |
| 去 JS 化模板 | 语言无关占位符 |

---

## 安装与配置

### 全局配置
```bash
git clone https://github.com/tkgeeked/agent-handoff.git ~/.gemini/config/skills/agent-handoff
```

### 单个项目集成
```bash
mkdir -p .agents/skills
git clone https://github.com/tkgeeked/agent-handoff.git .agents/skills/agent-handoff
```

#### Claude Code
```bash
cp resources/CLAUDE.template.md /path/to/your/project/CLAUDE.md
```

#### 其他 Agent
```bash
cp resources/README.template.md /path/to/your/project/README.md
```

---

## 开源协议

MIT License. 你可以根据你的技术栈进行定制。
