# AI Agent Governance & Handoff System

[简体中文](#简体中文) | English

A lightweight, developer-focused framework designed to standardize workflows, enforce repository hygiene, and maintain context continuity for AI coding assistants (including **Claude Code**, **Codex**, **Hermes Agent**, **Antigravity**, **Cursor**, and **Windsurf**).

---

## Why This Exists

AI coding assistants are highly capable, but they often suffer from "context fragmentation" across sessions. When an agent picks up a task, it may:
1. Lose track of the overall project roadmap and next steps.
2. Violate existing directory layouts by dropping config files, tests, or scratch scripts in random locations.
3. Commit architectural changes without documenting the rationale.

This system establishes a self-documenting **Active Dashboard** inside your codebase. It forces agents to read the current state upon onboarding, keep the directory structure synchronized, and log their actions at the end of each session.

---

## Core Mechanisms

```text
[Onboarding] ──> Read Dashboard & Dev Log ──> Execute Tasks ──> Run Tests/Lint ──> Update Dashboard & Log ──> [Handoff]
```

1. **Active Dashboard (README.md / CLAUDE.md)**: A single source of truth maintained by the AI agent containing the current file structure and live task statuses.
2. **Reverse-Chronological Dev Log**: A chronological journal appended by the agent at the end of every session, capturing *Actions*, *Decisions*, *Build Status*, and *Next Steps*.
3. **Directory Hygiene Boundaries**: Enforced separation between source code, tests, docs, and temporary scratchpads (git-ignored `.scratch/` directories).

---

## Platform Support Matrix

| Tool / Agent | Target File | Mechanism |
| :--- | :--- | :--- |
| **Claude Code** | `CLAUDE.md` | Reads build/test commands and project rules at startup. |
| **Antigravity / Codex** | `SKILL.md` | Loads as a custom skill/tool rule dynamically from `.agents/`. |
| **Cursor / Windsurf** | `.cursorrules` / `.windsurfrules` | Ingests instructions and file placement policies as system prompts. |
| **Hermes / General LLMs** | `README.md` | Leverages the designated `🤖 AI Agent Entrypoint` section. |

---

## File Structure

*   `SKILL.md`: Skill definition metadata for Antigravity & Codex environments.
*   `resources/README.template.md`: Boilerplate markdown dashboard for new repositories.
*   `resources/CLAUDE.md.template`: Pre-configured environment rules and build commands for Claude Code.
*   `references/best_practices.md`: Clear guidelines on modularity, dry runs, error logging, and scratch file hygiene.

---

## Setup & Installation

### 1. Global Setup (Automatically active across all workspaces)

For Antigravity/Codex:
```bash
git clone https://github.com/tkgeeked/ai-agent-governance.git ~/.gemini/config/skills/ai-agent-governance
```

### 2. Local Project Integration

Clone the rules into your project's agent folder:
```bash
mkdir -p .agents/skills
git clone https://github.com/tkgeeked/ai-agent-governance.git .agents/skills/ai-agent-governance
```

#### For Claude Code
Copy the Claude-specific configuration to your root:
```bash
cp resources/CLAUDE.md.template /path/to/your/project/CLAUDE.md
```

#### For Other Agents (Hermes, Cursor, Windsurf)
Copy the template README or append the `🤖 AI Agent Entrypoint` section to your existing `README.md`:
```bash
cp resources/README.template.md /path/to/your/project/README.md
```

---

## License

MIT License. Feel free to customize it for your specific tech stacks (Node.js, Python, Go, Rust, etc.).

---

## 简体中文

# AI Agent 项目接管与自我治理规范

这是一个轻量级、面向开发者的项目治理框架，用于规范 AI 编程助手（包括 **Claude Code**、**Codex**、**Hermes Agent**、**Antigravity**、**Cursor** 以及 **Windsurf**）的工作流，并确保多次开发会话之间的上下文连续性。

---

## 解决的问题

AI 编码助手虽然强大，但在跨会话开发时经常面临“上下文碎片化”的问题：
1. 迷失项目蓝图，不知道前人做到了哪一步，下一步该做什么。
2. 破坏目录规范，把临时脚本、配置文件或测试代码杂乱地丢在根目录或源码区。
3. 做了关键架构调整，却未记录任何决策背景和改动原因。

本规范通过在仓库中建立一个自我更新的**活体看板**（Active Dashboard），强制 AI 助手在接管时阅读状态、在开发时维护文件树、并在结束时撰写交接日志。

---

## 核心机制

```text
[接管项目] ──> 阅读看板与开发日志 ──> 执行任务 ──> 运行测试/校验 ──> 更新看板与日志 ──> [会话结束交接]
```

1. **活体看板 (README.md / CLAUDE.md)**：由 AI 助手在开发中实时维护的单一事实来源，包含最新文件树和当前任务状态。
2. **逆序开发日志**：AI 助手在每次会话结束前记录的简短日志，包括所做更改、技术选型决策及明确的下一步交接任务。
3. **严格的目录边界**：清晰定义生产代码、测试、以及临时脚本的存放位置，禁止非生产文件污染主干目录（引入 `.gitignore` 的 `.scratch/` 目录）。

---

## 平台适配矩阵

| AI 工具 / 代理 | 目标配置文件 | 作用机制 |
| :--- | :--- | :--- |
| **Claude Code** | `CLAUDE.md` | 启动时自动读取构建、测试命令及代码风格约束。 |
| **Antigravity / Codex** | `SKILL.md` | 动态加载为项目或全局 Skill，规范底层行为逻辑。 |
| **Cursor / Windsurf** | `.cursorrules` / `.windsurfrules` | 注入为系统提示词，确立目录结构规则和代码规范。 |
| **Hermes / 通用 LLM** | `README.md` | 通过阅读专门的 `🤖 AI Agent Entrypoint` 锚点段落引导接管。 |

---

## 目录结构

*   `SKILL.md`：适配 Antigravity / Codex 自定义 Skill 系统的配置文件。
*   `resources/README.template.md`：用于新项目初始化的通用 README 看板模板。
*   `resources/CLAUDE.md.template`：适用于 Claude Code 的构建、测试与代码规范配置模板。
*   `references/best_practices.md`：面向 AI 的模块化编程、异常处理与工作区卫生规范手册。

---

## 安装与配置

### 1. 全局配置 (所有项目默认可用)

针对 Antigravity/Codex：
```bash
git clone https://github.com/tkgeeked/ai-agent-governance.git ~/.gemini/config/skills/ai-agent-governance
```

### 2. 单个项目集成

将规范放入项目的 agent 目录：
```bash
mkdir -p .agents/skills
git clone https://github.com/tkgeeked/ai-agent-governance.git .agents/skills/ai-agent-governance
```

#### 对于 Claude Code
将 Claude 专属配置文件复制到项目根目录下：
```bash
cp resources/CLAUDE.md.template /path/to/your/project/CLAUDE.md
```

#### 对于其他 Agent (Hermes, Cursor, Windsurf)
直接将模板 README 复制到根目录，或将 `🤖 AI Agent Entrypoint` 锚点段落合并进你现有的 `README.md` 中：
```bash
cp resources/README.template.md /path/to/your/project/README.md
```

---

## 开源协议

MIT License. 你可以根据你的技术栈（Node.js, Python, Go, Rust 等）进行定制。
